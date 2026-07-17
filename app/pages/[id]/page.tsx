'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWordPressApi, useWordPressApiConfig } from '@/hooks/use-wordpress-api';
import { ContentRenderer } from '@/components/content-renderer';
import { ConfigForm } from '@/components/config-form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { WordPressPage } from '@/lib/api';

export default function SinglePagePage() {
  const { id } = useParams();
  const router = useRouter();
  const { apiConfig } = useWordPressApiConfig();
  const [imageError, setImageError] = useState(false);

  // Fetch page with embedding of featured media and author
  const { 
    data: page, 
    isLoading, 
    error 
  } = useWordPressApi<WordPressPage>(
    `/wp/v2/pages/${id}`,
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

  if (error || !page) {
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
          <p className="font-semibold">Error loading page</p>
          <p className="text-sm">{error || 'Page not found'}</p>
        </div>
      </div>
    );
  }

  // Get featured image if available
  const featuredImage = page._embedded?.['wp:featuredmedia']?.[0]?.source_url;

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
          className="text-3xl md:text-4xl font-bold mb-8"
          dangerouslySetInnerHTML={{ __html: page.title.rendered }}
        />

        {featuredImage && !imageError && (
          <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
            <Image
              src={featuredImage}
              alt={page.title.rendered}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
              className="object-cover"
              priority
              onError={() => setImageError(true)}
            />
          </div>
        )}

        <ContentRenderer 
          content={page.content.rendered} 
          className="prose prose-sm sm:prose lg:prose-lg mx-auto"
        />
      </article>
    </div>
  );
}