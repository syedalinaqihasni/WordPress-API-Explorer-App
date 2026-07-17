'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, Tag, Clock } from 'lucide-react';
import { stripHtmlTags, truncateText, formatDateRelative, WordPressPost } from '@/lib/api';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: WordPressPost;
  imagePriority?: boolean;
}

export function PostCard({ post, imagePriority = false }: PostCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Get featured image if available
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  
  // Author info
  const author = post._embedded?.['author']?.[0];
  
  // Categories
  const categories = post._embedded?.['wp:term']?.[0] || [];
  
  // Format excerpt
  const excerpt = stripHtmlTags(post.excerpt.rendered);
  const truncatedExcerpt = truncateText(excerpt, 160);

  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="aspect-video relative overflow-hidden">
        {featuredImage && !imageError ? (
          <Image
            src={featuredImage}
            alt={stripHtmlTags(post.title.rendered)}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
            priority={imagePriority}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDateRelative(post.date)}
          </span>
          {author && (
            <span>
              by {author.name}
            </span>
          )}
        </div>
        <Link href={`/posts/${post.id}`} className="hover:underline">
          <h3 
            className="font-bold text-lg line-clamp-2"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </Link>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground text-sm line-clamp-3">
          {truncatedExcerpt}
        </p>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start pt-0">
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {categories.slice(0, 3).map((category: any) => (
              <Badge key={category.id} variant="secondary" className="text-xs">
                {category.name}
              </Badge>
            ))}
            {categories.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{categories.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <Link href={`/posts/${post.id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            Read More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}