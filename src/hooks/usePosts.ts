import { useState, useCallback } from 'react';
import { mockPosts, Post, getPostsByStoryOrder, getPostsByDate } from '@/data/mockPosts';

// Store for posts (simulates state management)
let postsStore = [...mockPosts];

export type { Post };

export function usePublishedPosts() {
  const publishedPosts = postsStore.filter(p => p.published);
  return {
    data: getPostsByDate(publishedPosts),
    isLoading: false,
  };
}

export function usePostsByStoryOrder() {
  const publishedPosts = postsStore.filter(p => p.published);
  return {
    data: getPostsByStoryOrder(publishedPosts),
    isLoading: false,
  };
}

export function usePost(slug: string) {
  const post = postsStore.find(p => p.slug === slug);
  return {
    data: post || null,
    isLoading: false,
    error: post ? null : new Error('Post not found'),
  };
}

export function useAllPosts() {
  return {
    data: [...postsStore],
    isLoading: false,
  };
}

export function usePostsStore() {
  const [posts, setPosts] = useState<Post[]>([...postsStore]);

  const updatePostOrder = useCallback((reorderedPosts: Post[]) => {
    const updatedPosts = reorderedPosts.map((post, index) => ({
      ...post,
      story_order: index + 1,
    }));
    postsStore = updatedPosts;
    setPosts(updatedPosts);
  }, []);

  const refreshPosts = useCallback(() => {
    setPosts([...postsStore]);
  }, []);

  return {
    posts: getPostsByStoryOrder(posts),
    updatePostOrder,
    refreshPosts,
  };
}
