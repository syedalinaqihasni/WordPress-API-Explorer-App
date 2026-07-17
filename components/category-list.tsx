'use client';

import Link from 'next/link';
import { WordPressCategory } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Folder } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryListProps {
  categories: WordPressCategory[];
  isLoading?: boolean;
}

export function CategoryList({ categories, isLoading = false }: CategoryListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <Card key={index} className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No categories found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/categories/${category.id}`} className="block h-full">
          <Card className="h-full transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Folder className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription>
                    {category.count} {category.count === 1 ? 'post' : 'posts'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {category.description ? (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {category.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Browse all posts in this category
                </p>
              )}
              {category.parent > 0 && (
                <Badge variant="outline" className="mt-3">
                  Has parent
                </Badge>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}