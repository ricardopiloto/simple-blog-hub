import { authStorage } from '@/auth/storage';
import type { Post, OrderBy, CreateOrUpdatePostPayload, AuthorListItem, UserListItem, CreateUserPayload, UpdateUserPayload, NextStoryOrderResponse, PagedPostsResponse, DashboardStats, GenerateImageResponse } from './types';

const defaultBffUrl = 'http://localhost:5000';

function getBffBaseUrl(): string {
  const env = import.meta.env?.VITE_BFF_URL;
  if (typeof env === 'string' && env.trim()) return env.trim().replace(/\/$/, '');
  return defaultBffUrl;
}

export function parseBffErrorMessage(status: number, text: string): string {
  if (status === 404) return 'Not found';
  const trimmed = text.trim();
  if (!trimmed) return `Erro do servidor (${status})`;
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      const parsed = JSON.parse(trimmed) as string;
      if (typeof parsed === 'string' && parsed.length > 0) return parsed;
    } catch {
      // fall through
    }
  }
  try {
    const json = JSON.parse(trimmed) as {
      title?: string;
      detail?: string;
      message?: string;
      error?: string;
      errors?: Record<string, string[]>;
    };
    if (typeof json === 'string') return json;
    if (json.detail) return json.detail;
    if (json.message) return json.message;
    if (json.error) return json.error;
    if (json.errors) {
      const firstKey = Object.keys(json.errors)[0];
      const firstMsg = firstKey ? json.errors[firstKey]?.[0] : undefined;
      if (firstMsg) return firstMsg;
    }
    if (json.title && json.title !== 'Bad Request') return json.title;
  } catch {
    // plain text body from API
  }
  return trimmed.length > 200 ? `${trimmed.slice(0, 200)}…` : trimmed;
}

/** Public request (no auth). Path is relative to BFF base (e.g. "bff/posts?order=date"). */
async function requestPublic<T>(path: string, options?: RequestInit): Promise<T | undefined> {
  const url = `${getBffBaseUrl()}/${path}`;
  const res = await fetch(url, { ...options, headers: { Accept: 'application/json', ...options?.headers } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(parseBffErrorMessage(res.status, text));
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
    throw new Error(parseBffErrorMessage(res.status, text));
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
  if (payload.cloudflare_account_id !== undefined) body.cloudflare_account_id = payload.cloudflare_account_id ?? null;
  if (payload.cloudflare_api_token !== undefined) body.cloudflare_api_token = payload.cloudflare_api_token;
  if (payload.cloudflare_image_model !== undefined) body.cloudflare_image_model = payload.cloudflare_image_model;
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

export class ImageGenerationError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = 'ImageGenerationError';
  }
}

const IMAGE_ERROR_MESSAGES: Record<string, string> = {
  no_credentials: 'Configure o Account ID e o API Token Cloudflare em Contas antes de gerar imagens.',
  invalid_credentials:
    'Credenciais Cloudflare rejeitadas. Verifique Account ID e API Token em Contas.',
  invalid_token:
    'API Token inválido ou sem permissão. Crie um token em Workers AI → Use REST API com permissões Workers AI Read e Edit (não use a Global API Key).',
  token_expired:
    'O API Token Cloudflare expirou. Crie um novo token em Workers AI → Use REST API e actualize em Contas.',
  account_mismatch:
    'O Account ID não corresponde a esta conta Cloudflare. Copie o Account ID em Workers AI → Use REST API.',
  workers_ai_denied:
    'A Cloudflare recusou o acesso ao Workers AI. Confirme permissões Workers AI Read e Edit e que o token não tem filtro de IP.',
  quota_exceeded:
    'A quota ou os créditos de Workers AI da sua conta Cloudflare esgotaram-se. Verifique o plano e o consumo no dashboard Cloudflare.',
  rate_limit: 'Limite de pedidos da Cloudflare atingido. Aguarde alguns minutos e tente novamente.',
  model_unavailable:
    'O modelo de imagem não está disponível nesta conta Cloudflare. Verifique o catálogo Workers AI.',
  service_unavailable:
    'O serviço Workers AI da Cloudflare está temporariamente indisponível. Tente novamente mais tarde.',
  token_decrypt_failed:
    'Não foi possível ler o API Token guardado. Abra Contas e cole o API Token novamente.',
  encryption_not_configured:
    'O servidor não está configurado para guardar tokens Cloudflare. Contacte o operador.',
  timeout: 'A geração demorou demais. Tente novamente em instantes.',
  provider_error: 'Não foi possível gerar a imagem. Tente novamente mais tarde.',
  empty_prompt: 'O prompt não pode estar vazio.',
};

export type CloudflareVerifyResult = {
  ok: boolean;
  message: string;
  error?: string;
};

/**
 * Test saved Cloudflare credentials for the logged-in author.
 */
export async function verifyCloudflareCredentials(): Promise<CloudflareVerifyResult> {
  const token = authStorage.getToken();
  if (!token) {
    authStorage.clear();
    throw new ImageGenerationError('Unauthorized', undefined, 401);
  }

  const url = `${getBffBaseUrl()}/bff/image-generation/verify`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    authStorage.clear();
    throw new ImageGenerationError('Unauthorized', undefined, 401);
  }

  const body = (await res.json()) as { ok?: boolean; message?: string; error?: string };
  const message =
    body.message ||
    (body.error && IMAGE_ERROR_MESSAGES[body.error]) ||
    IMAGE_ERROR_MESSAGES.provider_error;

  return {
    ok: body.ok === true,
    message,
    error: body.error,
  };
}

/**
 * Generate an image from a text prompt (protected; requires Cloudflare credentials in Contas).
 */
export async function generateImage(prompt: string): Promise<string> {
  const token = authStorage.getToken();
  if (!token) {
    authStorage.clear();
    throw new ImageGenerationError('Unauthorized', undefined, 401);
  }

  const url = `${getBffBaseUrl()}/bff/image-generation/generate`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ prompt }),
  });

  if (res.status === 401) {
    authStorage.clear();
    throw new ImageGenerationError('Unauthorized', undefined, 401);
  }

  if (!res.ok) {
    let code: string | undefined;
    let serverMessage: string | undefined;
    try {
      const body = (await res.json()) as { error?: string; message?: string };
      code = body.error;
      serverMessage = body.message;
    } catch {
      // ignore parse errors
    }
    const message =
      serverMessage || (code && IMAGE_ERROR_MESSAGES[code]) || IMAGE_ERROR_MESSAGES.provider_error;
    throw new ImageGenerationError(message, code, res.status);
  }

  const data = (await res.json()) as GenerateImageResponse;
  if (!data.image) throw new ImageGenerationError(IMAGE_ERROR_MESSAGES.provider_error, 'provider_error', res.status);
  return data.image;
}
