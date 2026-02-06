import { authStorage } from '@/auth/storage';
import type { Post, OrderBy, CreateOrUpdatePostPayload, AuthorListItem, UserListItem, CreateUserPayload, UpdateUserPayload, NextStoryOrderResponse } from './types';

const defaultBffUrl = 'http://localhost:5000';

function getBffBaseUrl(): string {
  const env = import.meta.env?.VITE_BFF_URL;
  if (typeof env === 'string' && env.trim()) return env.trim().replace(/\/$/, '');
  return defaultBffUrl;
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...options, headers: { Accept: 'application/json', ...options?.headers } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(res.status === 404 ? 'Not found' : `BFF error: ${res.status} ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

async function fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  if (!token) {
    authStorage.clear();
    throw new Error('Unauthorized');
  }
  const headers = new Headers(options.headers);
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
  return res.json() as Promise<T>;
}

/**
 * List published posts from BFF (public).
 * @param order - 'date' (default) or 'story'
 */
export async function fetchPosts(order: OrderBy = 'date'): Promise<Post[]> {
  const base = getBffBaseUrl();
  return fetchJson<Post[]>(`${base}/bff/posts?order=${encodeURIComponent(order)}`);
}

/**
 * Get a single post by slug from BFF (public).
 */
export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const base = getBffBaseUrl();
  try {
    return await fetchJson<Post>(`${base}/bff/posts/${encodeURIComponent(slug)}`);
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
  const base = getBffBaseUrl();
  const res = await fetch(`${base}/bff/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return {
    token: data.token,
    user_id: data.user_id ?? '',
    author: data.author,
    is_admin: Boolean(data.is_admin),
    must_change_password: Boolean(data.must_change_password),
  };
}

/**
 * List all posts for the author area (protected).
 * Every author sees all posts; actions (edit/delete) are decided client-side.
 */
export async function fetchAllPostsForAuthorArea(): Promise<Post[]> {
  const base = getBffBaseUrl();
  return fetchWithAuth<Post[]>(`${base}/bff/posts/author-area`);
}

/**
 * Get post by id for editing, content in Markdown (protected).
 */
export async function fetchPostByIdForEdit(id: string): Promise<Post> {
  const base = getBffBaseUrl();
  return fetchWithAuth<Post>(`${base}/bff/posts/edit/${encodeURIComponent(id)}`);
}

/**
 * Get next suggested story_order for a new post (max among published + 1, or 1). Protected.
 */
export async function fetchNextStoryOrder(): Promise<number> {
  const base = getBffBaseUrl();
  const data = await fetchWithAuth<NextStoryOrderResponse>(`${base}/bff/posts/next-story-order`);
  return data.next_story_order;
}

/**
 * Create post (protected).
 */
export async function createPost(payload: CreateOrUpdatePostPayload): Promise<Post> {
  const base = getBffBaseUrl();
  return fetchWithAuth<Post>(`${base}/bff/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/**
 * Update post (protected).
 */
export async function updatePost(id: string, payload: CreateOrUpdatePostPayload): Promise<Post> {
  const base = getBffBaseUrl();
  return fetchWithAuth<Post>(`${base}/bff/posts/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/**
 * Update story order for multiple posts (protected).
 */
export async function updateStoryOrder(orders: { id: string; story_order: number }[]): Promise<void> {
  const base = getBffBaseUrl();
  await fetchWithAuth<void>(`${base}/bff/posts/story-order`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orders),
  });
}

/**
 * Delete post (protected; only owner can delete).
 */
export async function deletePost(id: string): Promise<void> {
  const base = getBffBaseUrl();
  const token = authStorage.getToken();
  if (!token) throw new Error('Unauthorized');
  const res = await fetch(`${base}/bff/posts/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) {
    authStorage.clear();
    throw new Error('Unauthorized');
  }
  if (res.status === 403) throw new Error('Forbidden');
  if (res.status === 404) throw new Error('Not found');
  if (!res.ok) throw new Error(`BFF error: ${res.status}`);
}

/**
 * List authors for invite selector (protected).
 */
export async function fetchAuthors(): Promise<AuthorListItem[]> {
  const base = getBffBaseUrl();
  return fetchWithAuth<AuthorListItem[]>(`${base}/bff/authors`);
}

/**
 * Add collaborator to post (protected; owner only).
 */
export async function addCollaborator(postId: string, authorId: string): Promise<void> {
  const base = getBffBaseUrl();
  const token = authStorage.getToken();
  if (!token) throw new Error('Unauthorized');
  const res = await fetch(`${base}/bff/posts/${encodeURIComponent(postId)}/collaborators`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ author_id: authorId }),
  });
  if (res.status === 401) {
    authStorage.clear();
    throw new Error('Unauthorized');
  }
  if (res.status === 403) throw new Error('Forbidden');
  if (res.status === 404) throw new Error('Not found');
  if (res.status === 409) throw new Error('Conflict');
  if (!res.ok) throw new Error(`BFF error: ${res.status}`);
}

/**
 * Remove collaborator from post (protected; owner only).
 */
export async function removeCollaborator(postId: string, authorId: string): Promise<void> {
  const base = getBffBaseUrl();
  const token = authStorage.getToken();
  if (!token) throw new Error('Unauthorized');
  const res = await fetch(`${base}/bff/posts/${encodeURIComponent(postId)}/collaborators/${encodeURIComponent(authorId)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) {
    authStorage.clear();
    throw new Error('Unauthorized');
  }
  if (res.status === 403) throw new Error('Forbidden');
  if (res.status === 404) throw new Error('Not found');
  if (!res.ok) throw new Error(`BFF error: ${res.status}`);
}

/**
 * List users (protected; Admin only).
 */
export async function fetchUsers(): Promise<UserListItem[]> {
  const base = getBffBaseUrl();
  return fetchWithAuth<UserListItem[]>(`${base}/bff/users`);
}

/**
 * Get current user (protected; any authenticated user).
 */
export async function fetchCurrentUser(): Promise<UserListItem> {
  const base = getBffBaseUrl();
  return fetchWithAuth<UserListItem>(`${base}/bff/users/me`);
}

/**
 * Create user (protected; Admin only).
 */
export async function createUser(payload: CreateUserPayload): Promise<UserListItem> {
  const base = getBffBaseUrl();
  const res = await fetchWithAuth<UserListItem>(`${base}/bff/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      author_name: payload.author_name,
    }),
  });
  return res;
}

/**
 * Update user (protected; Admin: email/password; self: password only).
 */
export async function updateUser(userId: string, payload: UpdateUserPayload): Promise<void> {
  const base = getBffBaseUrl();
  const token = authStorage.getToken();
  if (!token) throw new Error('Unauthorized');
  const body: Record<string, string | null> = {};
  if (payload.email !== undefined) body.email = payload.email;
  if (payload.password !== undefined) body.password = payload.password;
  if (payload.author_name !== undefined) body.author_name = payload.author_name;
  if (payload.author_bio !== undefined) body.author_bio = payload.author_bio ?? null;
  const res = await fetch(`${base}/bff/users/${encodeURIComponent(userId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  if (res.status === 401) {
    authStorage.clear();
    throw new Error('Unauthorized');
  }
  if (res.status === 403) throw new Error('Forbidden');
  if (res.status === 404) throw new Error('Not found');
  if (res.status === 409) throw new Error('Conflict');
  if (!res.ok) throw new Error(`BFF error: ${res.status}`);
}

/**
 * Delete user (protected; Admin only).
 */
export async function deleteUser(userId: string): Promise<void> {
  const base = getBffBaseUrl();
  const token = authStorage.getToken();
  if (!token) throw new Error('Unauthorized');
  const res = await fetch(`${base}/bff/users/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) {
    authStorage.clear();
    throw new Error('Unauthorized');
  }
  if (res.status === 403) throw new Error('Forbidden');
  if (res.status === 404) throw new Error('Not found');
  if (!res.ok) throw new Error(`BFF error: ${res.status}`);
}

/**
 * Reset user password to default (protected; Admin only). Target user must change password on next login.
 */
export async function resetUserPassword(userId: string): Promise<void> {
  const base = getBffBaseUrl();
  const token = authStorage.getToken();
  if (!token) throw new Error('Unauthorized');
  const res = await fetch(`${base}/bff/users/${encodeURIComponent(userId)}/reset-password`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) {
    authStorage.clear();
    throw new Error('Unauthorized');
  }
  if (res.status === 403) throw new Error('Forbidden');
  if (res.status === 404) throw new Error('Not found');
  if (!res.ok) throw new Error(`BFF error: ${res.status}`);
}
