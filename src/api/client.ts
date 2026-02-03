import type { Post, OrderBy } from './types';

const defaultBffUrl = 'http://localhost:5000';

function getBffBaseUrl(): string {
  const env = import.meta.env?.VITE_BFF_URL;
  if (typeof env === 'string' && env.trim()) return env.trim().replace(/\/$/, '');
  return defaultBffUrl;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(res.status === 404 ? 'Not found' : `BFF error: ${res.status} ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/**
 * List published posts from BFF.
 * @param order - 'date' (default) or 'story'
 */
export async function fetchPosts(order: OrderBy = 'date'): Promise<Post[]> {
  const base = getBffBaseUrl();
  return fetchJson<Post[]>(`${base}/bff/posts?order=${encodeURIComponent(order)}`);
}

/**
 * Get a single post by slug from BFF.
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
