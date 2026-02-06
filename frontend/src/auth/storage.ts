const TOKEN_KEY = 'blog_auth_token';
const AUTHOR_KEY = 'blog_auth_author';
const USER_ID_KEY = 'blog_auth_user_id';
const MUST_CHANGE_PASSWORD_KEY = 'blog_auth_must_change_password';

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
let mustChangePassword = false;

function loadFromStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    token = sessionStorage.getItem(TOKEN_KEY);
    const raw = sessionStorage.getItem(AUTHOR_KEY);
    author = raw ? (JSON.parse(raw) as AuthorInfo) : null;
    userId = sessionStorage.getItem(USER_ID_KEY);
    mustChangePassword = sessionStorage.getItem(MUST_CHANGE_PASSWORD_KEY) === '1';
  } catch {
    token = null;
    author = null;
    userId = null;
    mustChangePassword = false;
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
  getMustChangePassword(): boolean {
    return mustChangePassword;
  },
  setAuth(t: string, a: AuthorInfo, uid: string | null = null, mustChange: boolean = false): void {
    token = t;
    author = a;
    userId = uid ?? null;
    mustChangePassword = mustChange;
    try {
      sessionStorage.setItem(TOKEN_KEY, t);
      sessionStorage.setItem(AUTHOR_KEY, JSON.stringify(a));
      if (userId) sessionStorage.setItem(USER_ID_KEY, userId);
      else sessionStorage.removeItem(USER_ID_KEY);
      sessionStorage.setItem(MUST_CHANGE_PASSWORD_KEY, mustChange ? '1' : '0');
    } catch {}
  },
  setMustChangePassword(value: boolean): void {
    mustChangePassword = value;
    try {
      sessionStorage.setItem(MUST_CHANGE_PASSWORD_KEY, value ? '1' : '0');
    } catch {}
  },
  clear(): void {
    token = null;
    author = null;
    userId = null;
    mustChangePassword = false;
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(AUTHOR_KEY);
      sessionStorage.removeItem(USER_ID_KEY);
      sessionStorage.removeItem(MUST_CHANGE_PASSWORD_KEY);
    } catch {}
  },
  isAuthenticated(): boolean {
    return Boolean(token);
  },
  isAdmin(): boolean {
    return Boolean(author?.is_admin);
  },
};
