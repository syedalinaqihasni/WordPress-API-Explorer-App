'use client';

import { useState, useEffect } from 'react';
import { useWordPressApi, useWordPressApiConfig } from '@/hooks/use-wordpress-api';
import { ConfigForm } from '@/components/config-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import { WordPressPage, truncateText, stripHtmlTags } from '@/lib/api';

export default function PagesPage() {
  const { apiConfig } = useWordPressApiConfig();
  const [page, setPage] = useState(1);
  const [allPages, setAllPages] = useState<WordPressPage[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Fetch pages with embedding of featured media and author
  const { 
    data: pages, 
    isLoading, 
    error 
  } = useWordPressApi<WordPressPage[]>(
    '/wp/v2/pages',
    { 
      _embed: 'true', 
      per_page: '10',
      page: page.toString()
    },
    !!apiConfig
  );

  // Update allPages when new pages are fetched
  useEffect(() => {
    if (pages) {
      if (pages.length === 0) {
        setHasMore(false);
      } else {
        setAllPages((prev) => {
          // Filter out duplicates based on ID
          const newPages = pages.filter(
            (page) => !prev.some((p) => p.id === page.id)
          );
          return [...prev, ...newPages];
        });
      }
    }
  }, [pages]);

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

  if (isLoading && page === 1) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pages</h1>
          <p className="text-muted-foreground">
            Browse all pages from your WordPress site
          </p>
        </div>

        <div className="grid gap-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="gap-2">
                <Skeleton className="h-7 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pages</h1>
          <p className="text-muted-foreground">
            Browse all pages from your WordPress site
          </p>
        </div>

        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p className="font-semibold">Error loading pages</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pages</h1>
        <p className="text-muted-foreground">
          Browse all pages from your WordPress site
        </p>
      </div>

      {allPages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No pages found.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {allPages.map((page) => (
            <Card key={page.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle 
                      className="text-xl mb-1"
                      dangerouslySetInnerHTML={{ __html: page.title.rendered }}
                    />
                    <CardDescription>
                      ID: {page.id} | Slug: {page.slug}
                    </CardDescription>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {truncateText(stripHtmlTags(page.excerpt.rendered || page.content.rendered), 200)}
                </p>
                <Link href={`/pages/${page.id}`}>
                  <Button variant="outline" size="sm" className="gap-1 group">
                    View Page
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button onClick={handleLoadMore} disabled={isLoading && page > 1}>
            {isLoading && page > 1 ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}