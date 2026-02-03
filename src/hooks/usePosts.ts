import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts, fetchPostBySlug } from '@/api/client';
import type { Post } from '@/api/types';

export type { Post };

export function usePublishedPosts() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['posts', 'date'],
    queryFn: () => fetchPosts('date'),
  });
  return {
    data: data ?? undefined,
    isLoading,
    error: isError ? (error as Error) : undefined,
  };
}

export function usePostsByStoryOrder() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['posts', 'story'],
    queryFn: () => fetchPosts('story'),
  });
  return {
    data: data ?? undefined,
    isLoading,
    error: isError ? (error as Error) : undefined,
  };
}

export function usePost(slug: string) {
  const enabled = Boolean(slug?.trim());
  const { data, isLoading, isError, error, isFetched } = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const post = await fetchPostBySlug(slug);
      if (post == null) throw new Error('Post not found');
      return post;
    },
    enabled,
  });
  return {
    data: data ?? null,
    isLoading: enabled ? isLoading : false,
    error: isError ? (error as Error) : (enabled && isFetched && !data ? new Error('Post not found') : null),
  };
}

export function useAllPosts() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['posts', 'date'],
    queryFn: () => fetchPosts('date'),
  });
  return {
    data: data ?? [],
    isLoading,
    error: isError ? (error as Error) : undefined,
  };
}

function sortByStoryOrder(posts: Post[]) {
  return [...posts].sort((a, b) => a.story_order - b.story_order);
}

export function usePostsStore() {
  const { data: fetchedPosts = [] } = useQuery({
    queryKey: ['posts', 'story'],
    queryFn: () => fetchPosts('story'),
  });

  const [posts, setPosts] = useState<Post[]>(() => sortByStoryOrder(fetchedPosts));

  useEffect(() => {
    if (fetchedPosts.length > 0) setPosts(sortByStoryOrder(fetchedPosts));
  }, [fetchedPosts]);

  const updatePostOrder = useCallback((reorderedPosts: Post[]) => {
    const updated = reorderedPosts.map((post, index) => ({
      ...post,
      story_order: index + 1,
    }));
    setPosts(updated);
  }, []);

  const refreshPosts = useCallback(() => {
    setPosts(sortByStoryOrder(fetchedPosts));
  }, [fetchedPosts]);

  return {
    posts,
    updatePostOrder,
    refreshPosts,
  };
}
