/** Post type aligned with BFF/API response (snake_case from API). */
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  story_order: number;
  /** When false, post is excluded from Índice da História and prev/next sequence. Default true. */
  include_in_story_order?: boolean;
  author_id?: string;
  /** Present only when the user is logged in (BFF includes it for authenticated requests). */
  view_count?: number;
  author: {
    name: string;
    avatar: string | null;
    bio: string | null;
  };
  collaborators?: { id: string; name: string }[];
}

export interface AuthorListItem {
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
}

export type OrderBy = 'date' | 'story';

/** Response from GET /bff/posts/next-story-order */
export interface NextStoryOrderResponse {
  next_story_order: number;
}

/** Response from GET /bff/posts when using page and pageSize (paginated list). */
export interface PagedPostsResponse {
  items: Post[];
  total: number;
}

export interface CreateOrUpdatePostPayload {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  cover_image?: string | null;
  published: boolean;
  story_order: number;
  /** When false, post is excluded from Índice da História. Default true. */
  include_in_story_order?: boolean;
}

export interface UserListItem {
  id: string;
  email: string;
  author_id: string;
  author_name: string;
  /** Breve descrição do autor (ex.: "Sonhador e amante de contos e RPG"). */
  author_bio?: string | null;
}

export interface CreateUserPayload {
  email: string;
  /** Optional; when omitted, API uses default password (senha123). User should change on first login. */
  password?: string;
  author_name: string;
}

export interface UpdateUserPayload {
  email?: string;
  password?: string;
  author_name?: string;
  /** Breve descrição do autor. */
  author_bio?: string | null;
}
