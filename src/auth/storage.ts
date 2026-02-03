const TOKEN_KEY = 'blog_auth_token';
const AUTHOR_KEY = 'blog_auth_author';

export interface AuthorInfo {
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
}

let token: string | null = null;
let author: AuthorInfo | null = null;

function loadFromStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(AUTHOR_KEY);
    author = raw ? (JSON.parse(raw) as AuthorInfo) : null;
  } catch {
    token = null;
    author = null;
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
  setAuth(t: string, a: AuthorInfo): void {
    token = t;
    author = a;
    try {
      localStorage.setItem(TOKEN_KEY, t);
      localStorage.setItem(AUTHOR_KEY, JSON.stringify(a));
    } catch {}
  },
  clear(): void {
    token = null;
    author = null;
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(AUTHOR_KEY);
    } catch {}
  },
  isAuthenticated(): boolean {
    return Boolean(token);
  },
};
