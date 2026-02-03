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
  author: {
    name: string;
    avatar: string | null;
    bio: string | null;
  };
}

export type OrderBy = 'date' | 'story';
