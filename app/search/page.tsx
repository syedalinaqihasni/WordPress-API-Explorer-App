'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useWordPressApi, useWordPressApiConfig } from '@/hooks/use-wordpress-api';
import { ConfigForm } from '@/components/config-form';
import { PostGrid } from '@/components/post-grid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import { WordPressPost } from '@/lib/api';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { apiConfig } = useWordPressApiConfig();
  const query = searchParams.get('query') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<WordPressPost[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Fetch posts with search query
  const { 
    data: posts, 
    isLoading, 
    error 
  } = useWordPressApi<WordPressPost[]>(
    '/wp/v2/posts',
    { 
      _embed: 'true', 
      search: query,
      per_page: '9',
      page: page.toString()
    },
    !!apiConfig && !!query
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

  // Reset state when query changes
  useEffect(() => {
    setPage(1);
    setAllPosts([]);
    setHasMore(true);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

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
        <h1 className="text-3xl font-bold mb-6">Search</h1>
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </div>
        </form>
      </div>

      {query ? (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              {isLoading && page === 1 ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </span>
              ) : error ? (
                'Error searching posts'
              ) : (
                `Search results for "${query}" (${allPosts.length})`
              )}
            </h2>
          </div>

          {error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              <p className="font-semibold">Error searching posts</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : (
            <PostGrid
              posts={allPosts}
              isLoading={isLoading && page === 1}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              isLoadingMore={isLoading && page > 1}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Enter a search term to find posts.
          </p>
        </div>
      )}
    </div>
  );
}