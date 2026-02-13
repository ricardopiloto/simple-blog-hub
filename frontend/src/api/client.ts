import { authStorage } from '@/auth/storage';
import type { Post, OrderBy, CreateOrUpdatePostPayload, AuthorListItem, UserListItem, CreateUserPayload, UpdateUserPayload, NextStoryOrderResponse, PagedPostsResponse, DashboardStats } from './types';

const defaultBffUrl = 'http://localhost:5000';

function getBffBaseUrl(): string {
  const env = import.meta.env?.VITE_BFF_URL;
  if (typeof env === 'string' && env.trim()) return env.trim().replace(/\/$/, '');
  return defaultBffUrl;
}

/** Public request (no auth). Path is relative to BFF base (e.g. "bff/posts?order=date"). */
async function requestPublic<T>(path: string, options?: RequestInit): Promise<T | undefined> {
  const url = `${getBffBaseUrl()}/${path}`;
  const res = await fetch(url, { ...options, headers: { Accept: 'application/json', ...options?.headers } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(res.status === 404 ? 'Not found' : `BFF error: ${res.status} ${text || res.statusText}`);
  }
  if (res.status === 204 || res.headers.get('content-length') === '0') return undefined as T;
  return res.json() as Promise<T>;
}

/** Authenticated request. Adds Bearer token; on 401 clears storage and throws. Path relative to BFF base. */
async function requestWithAuth<T>(path: string, options?: RequestInit): Promise<T | undefined> {
  const token = authStorage.getToken();
  if (!token) {
    authStorage.clear();
    throw new Error('Unauthorized');
  }
  const url = `${getBffBaseUrl()}/${path}`;
  const headers = new Headers(options?.headers);
  headers.set('Accept', 'application/json');
  headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    authStorage.clear();
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(res.status === 404 ? 'Not found' : `BFF error: ${res.status} ${text || res.statusText}`);
  }
  if (res.status === 204 || res.headers.get('content-length') === '0') return undefined as T;
  return res.json() as Promise<T>;
}

/**
 * List published posts from BFF (public).
 * @param order - 'date' (default) or 'story'
 */
export async function fetchPosts(order: OrderBy = 'date'): Promise<Post[]> {
  const data = await requestPublic<Post[]>(`bff/posts?order=${encodeURIComponent(order)}`);
  return data ?? [];
}

/**
 * Fetch a page of published posts with optional search (title, author, date) and date range (fromDate, toDate as yyyy-MM-dd).
 * Returns { items, total } for pagination.
 */
export async function fetchPostsPage(
  page: number,
  pageSize: number,
  search?: string,
  fromDate?: string,
  toDate?: string
): Promise<PagedPostsResponse> {
  const params = new URLSearchParams({ order: 'date', page: String(page), pageSize: String(pageSize) });
  if (search?.trim()) params.set('search', search.trim());
  if (fromDate?.trim()) params.set('fromDate', fromDate.trim());
  if (toDate?.trim()) params.set('toDate', toDate.trim());
  const data = await requestPublic<PagedPostsResponse>(`bff/posts?${params.toString()}`);
  return data ?? { items: [], total: 0 };
}

/**
 * Get a single post by slug from BFF. When the user is logged in, the request includes the token so the BFF returns view_count.
 */
export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const path = `bff/posts/${encodeURIComponent(slug)}`;
  try {
    const token = authStorage.getToken();
    const data = token
      ? await requestWithAuth<Post>(path)
      : await requestPublic<Post>(path);
    return data ?? null;
  } catch (e) {
    if (e instanceof Error && e.message === 'Not found') return null;
    throw e;
  }
}

/**
 * Login; returns { token, user_id, author, is_admin, must_change_password } or null on failure.
 */
export async function login(
  email: string,
  password: string
): Promise<{ token: string; user_id: string; author: { id: string; name: string; avatar: string | null; bio: string | null }; is_admin: boolean; must_change_password: boolean } | null> {
  try {
    const data = await requestPublic<{ token: string; user_id: string; author: unknown; is_admin: boolean; must_change_password: boolean }>(
      'bff/auth/login',
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }
    );
    if (!data) return null;
    return {
      token: data.token,
      user_id: data.user_id ?? '',
      author: data.author as { id: string; name: string; avatar: string | null; bio: string | null },
      is_admin: Boolean(data.is_admin),
      must_change_password: Boolean(data.must_change_password),
    };
  } catch {
    return null;
  }
}

/**
 * Dashboard statistics for the author area (protected).
 */
export async function fetchDashboardStats(): Promise<DashboardStats | null> {
  const data = await requestWithAuth<DashboardStats>('bff/dashboard/stats');
  return data ?? null;
}

/**
 * List all posts for the author area (protected).
 * Every author sees all posts; actions (edit/delete) are decided client-side.
 */
export async function fetchAllPostsForAuthorArea(): Promise<Post[]> {
  const data = await requestWithAuth<Post[]>(`bff/posts/author-area`);
  return data ?? [];
}

/**
 * Get post by id for editing, content in Markdown (protected).
 */
export async function fetchPostByIdForEdit(id: string): Promise<Post> {
  const data = await requestWithAuth<Post>(`bff/posts/edit/${encodeURIComponent(id)}`);
  if (!data) throw new Error('Not found');
  return data;
}

/**
 * Get next suggested story_order for a new post (max among published + 1, or 1). Protected.
 */
export async function fetchNextStoryOrder(): Promise<number> {
  const data = await requestWithAuth<NextStoryOrderResponse>(`bff/posts/next-story-order`);
  return data?.next_story_order ?? 1;
}

/**
 * Create post (protected).
 */
export async function createPost(payload: CreateOrUpdatePostPayload): Promise<Post> {
  const data = await requestWithAuth<Post>('bff/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!data) throw new Error('BFF error: no body');
  return data;
}

/**
 * Update post (protected).
 */
export async function updatePost(id: string, payload: CreateOrUpdatePostPayload): Promise<Post> {
  const data = await requestWithAuth<Post>(`bff/posts/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!data) throw new Error('BFF error: no body');
  return data;
}

/**
 * Update story order for multiple posts (protected).
 */
export async function updateStoryOrder(orders: { id: string; story_order: number }[]): Promise<void> {
  await requestWithAuth<void>('bff/posts/story-order', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orders),
  });
}

/**
 * Upload cover image (protected). Returns the public URL path for the saved image (e.g. /images/posts/xxx.jpg).
 */
export async function uploadCoverImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const data = await requestWithAuth<{ url: string }>('bff/uploads/cover', {
    method: 'POST',
    body: formData,
  });
  if (!data) throw new Error('BFF error: no body');
  return data;
}

/**
 * Delete post (protected; only owner can delete).
 */
export async function deletePost(id: string): Promise<void> {
  await requestWithAuth<void>(`bff/posts/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

/**
 * List authors for invite selector (protected).
 */
export async function fetchAuthors(): Promise<AuthorListItem[]> {
  const data = await requestWithAuth<AuthorListItem[]>('bff/authors');
  return data ?? [];
}

/**
 * Add collaborator to post (protected; owner only).
 */
export async function addCollaborator(postId: string, authorId: string): Promise<void> {
  await requestWithAuth<void>(`bff/posts/${encodeURIComponent(postId)}/collaborators`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author_id: authorId }),
  });
}

/**
 * Remove collaborator from post (protected; owner only).
 */
export async function removeCollaborator(postId: string, authorId: string): Promise<void> {
  await requestWithAuth<void>(`bff/posts/${encodeURIComponent(postId)}/collaborators/${encodeURIComponent(authorId)}`, {
    method: 'DELETE',
  });
}

/**
 * List users (protected; Admin only).
 */
export async function fetchUsers(): Promise<UserListItem[]> {
  const data = await requestWithAuth<UserListItem[]>('bff/users');
  return data ?? [];
}

/**
 * Get current user (protected; any authenticated user).
 */
export async function fetchCurrentUser(): Promise<UserListItem> {
  const data = await requestWithAuth<UserListItem>('bff/users/me');
  if (!data) throw new Error('Not found');
  return data;
}

/**
 * Create user (protected; Admin only).
 */
export async function createUser(payload: CreateUserPayload): Promise<UserListItem> {
  const data = await requestWithAuth<UserListItem>('bff/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      author_name: payload.author_name,
    }),
  });
  if (!data) throw new Error('BFF error: no body');
  return data;
}

/**
 * Update user (protected; Admin: email/password; self: password only).
 */
export async function updateUser(userId: string, payload: UpdateUserPayload): Promise<void> {
  const body: Record<string, string | null> = {};
  if (payload.email !== undefined) body.email = payload.email;
  if (payload.password !== undefined) body.password = payload.password;
  if (payload.author_name !== undefined) body.author_name = payload.author_name;
  if (payload.author_bio !== undefined) body.author_bio = payload.author_bio ?? null;
  await requestWithAuth<void>(`bff/users/${encodeURIComponent(userId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/**
 * Delete user (protected; Admin only).
 */
export async function deleteUser(userId: string): Promise<void> {
  await requestWithAuth<void>(`bff/users/${encodeURIComponent(userId)}`, { method: 'DELETE' });
}

/**
 * Reset user password to default (protected; Admin only). Target user must change password on next login.
 */
export async function resetUserPassword(userId: string): Promise<void> {
  await requestWithAuth<void>(`bff/users/${encodeURIComponent(userId)}/reset-password`, { method: 'POST' });
}
