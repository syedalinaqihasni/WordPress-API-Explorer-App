'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWordPressApi, useWordPressApiConfig } from '@/hooks/use-wordpress-api';
import { ContentRenderer } from '@/components/content-renderer';
import { ConfigForm } from '@/components/config-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { WordPressPost, formatDateRelative } from '@/lib/api';

export default function SinglePostPage() {
  const { id } = useParams();
  const router = useRouter();
  const { apiConfig } = useWordPressApiConfig();
  const [imageError, setImageError] = useState(false);

  // Fetch post with embedding of featured media, author, and terms
  const { 
    data: post, 
    isLoading, 
    error 
  } = useWordPressApi<WordPressPost>(
    `/wp/v2/posts/${id}`,
    { _embed: 'true' },
    !!apiConfig
  );

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
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Skeleton className="h-8 w-3/4 mb-4" />
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
        
        <Skeleton className="h-[300px] w-full mb-8" />
        
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p className="font-semibold">Error loading post</p>
          <p className="text-sm">{error || 'Post not found'}</p>
        </div>
      </div>
    );
  }

  // Get featured image if available
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  
  // Author info
  const author = post._embedded?.['author']?.[0];
  
  // Categories and tags
  const categories = post._embedded?.['wp:term']?.[0] || [];
  const tags = post._embedded?.['wp:term']?.[1] || [];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <article>
        <h1 
          className="text-3xl md:text-4xl font-bold mb-4"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDateRelative(post.date)}
          </div>
          
          {author && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {author.name}
            </div>
          )}
        </div>

        {featuredImage && !imageError && (
          <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
            <Image
              src={featuredImage}
              alt={post.title.rendered}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
              className="object-cover"
              priority
              onError={() => setImageError(true)}
            />
          </div>
        )}

        <ContentRenderer 
          content={post.content.rendered} 
          className="prose prose-sm sm:prose lg:prose-lg mx-auto mb-8"
        />

        {(categories.length > 0 || tags.length > 0) && (
          <div className="border-t pt-6 mt-8">
            {categories.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Categories:</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category: any) => (
                    <Badge key={category.id} variant="secondary">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: any) => (
                    <Badge key={tag.id} variant="outline">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </article>
    </div>
  );
}