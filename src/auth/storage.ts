const TOKEN_KEY = 'blog_auth_token';
const AUTHOR_KEY = 'blog_auth_author';
const USER_ID_KEY = 'blog_auth_user_id';

export interface AuthorInfo {
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  is_admin?: boolean;
}

let token: string | null = null;
let author: AuthorInfo | null = null;
let userId: string | null = null;

function loadFromStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    token = sessionStorage.getItem(TOKEN_KEY);
    const raw = sessionStorage.getItem(AUTHOR_KEY);
    author = raw ? (JSON.parse(raw) as AuthorInfo) : null;
    userId = sessionStorage.getItem(USER_ID_KEY);
  } catch {
    token = null;
    author = null;
    userId = null;
  }
}

loadFromStorage();

export const authStorage = {
  getToken(): string | null {
    return token;
  },
  getAuthor(): AuthorInfo | null {
    return author;
  },
  getUserId(): string | null {
    return userId;
  },
  setAuth(t: string, a: AuthorInfo, uid: string | null = null): void {
    token = t;
    author = a;
    userId = uid ?? null;
    try {
      sessionStorage.setItem(TOKEN_KEY, t);
      sessionStorage.setItem(AUTHOR_KEY, JSON.stringify(a));
      if (userId) sessionStorage.setItem(USER_ID_KEY, userId);
      else sessionStorage.removeItem(USER_ID_KEY);
    } catch {}
  },
  clear(): void {
    token = null;
    author = null;
    userId = null;
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(AUTHOR_KEY);
      sessionStorage.removeItem(USER_ID_KEY);
    } catch {}
  },
  isAuthenticated(): boolean {
    return Boolean(token);
  },
  isAdmin(): boolean {
    return Boolean(author?.is_admin);
  },
};
