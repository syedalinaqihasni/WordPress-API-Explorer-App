'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWordPressApi, useWordPressApiConfig } from '@/hooks/use-wordpress-api';
import { ConfigForm } from '@/components/config-form';
import { PostGrid } from '@/components/post-grid';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Folder } from 'lucide-react';
import { WordPressPost, WordPressCategory } from '@/lib/api';

export default function CategoryPostsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { apiConfig } = useWordPressApiConfig();
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<WordPressPost[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Fetch category
  const { 
    data: category, 
    isLoading: isCategoryLoading, 
    error: categoryError 
  } = useWordPressApi<WordPressCategory>(
    `/wp/v2/categories/${id}`,
    {},
    !!apiConfig
  );

  // Fetch posts in this category
  const { 
    data: posts, 
    isLoading: isPostsLoading, 
    error: postsError 
  } = useWordPressApi<WordPressPost[]>(
    '/wp/v2/posts',
    { 
      _embed: 'true', 
      categories: id as string,
      per_page: '9',
      page: page.toString()
    },
    !!apiConfig && !!category
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

  const isLoading = isCategoryLoading || (isPostsLoading && page === 1);
  const error = categoryError || postsError;

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="mb-8">
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-5 w-1/2" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error || 'Category not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Folder className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">{category.name}</h1>
        </div>
        
        {category.description && (
          <p className="text-muted-foreground">{category.description}</p>
        )}
        
        <p className="text-sm text-muted-foreground mt-2">
          {category.count} {category.count === 1 ? 'post' : 'posts'}
        </p>
      </div>

      <PostGrid
        posts={allPosts}
        isLoading={isPostsLoading && page === 1}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        isLoadingMore={isPostsLoading && page > 1}
      />
    </div>
  );
}