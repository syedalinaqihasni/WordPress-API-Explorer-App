'use client';

import { useState, useEffect } from 'react';
import { useWordPressApi, useWordPressApiConfig } from '@/hooks/use-wordpress-api';
import { ConfigForm } from '@/components/config-form';
import { PostGrid } from '@/components/post-grid';
import { WordPressPost, WordPressCategory } from '@/lib/api';

export default function PostsPage() {
  const { apiConfig } = useWordPressApiConfig();
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<WordPressPost[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Fetch posts with embedding of featured media, author, and terms
  const { 
    data: posts, 
    isLoading, 
    error,
    refetch 
  } = useWordPressApi<WordPressPost[]>(
    '/wp/v2/posts',
    { 
      _embed: 'true', 
      per_page: '9',
      page: page.toString()
    },
    !!apiConfig
  );

  // Fetch categories
  const { 
    data: categories 
  } = useWordPressApi<WordPressCategory[]>(
    '/wp/v2/categories',
    { per_page: '100' },
    !!apiConfig
  );

  // Update allPosts when new posts are fetched
  useEffect(() => {
    if (posts) {
      if (posts.length === 0) {
        setHasMore(false);
      } else {
        setAllPosts((prev) => {
          // Filter out duplicates based on ID
          const newPosts = posts.filter(
            (post) => !prev.some((p) => p.id === post.id)
          );
          return [...prev, ...newPosts];
        });
      }
    }
  }, [posts]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (!apiConfig) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Connect to WordPress API First
        </h1>
        <ConfigForm />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Posts</h1>
        <p className="text-muted-foreground">
          Browse all posts from your WordPress site
        </p>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p className="font-semibold">Error loading posts</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <PostGrid
          posts={allPosts}
          categories={categories || []}
          isLoading={isLoading && page === 1}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isLoadingMore={isLoading && page > 1}
        />
      )}
    </div>
  );
}