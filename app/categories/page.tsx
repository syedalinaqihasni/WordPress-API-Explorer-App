'use client';

import { useWordPressApi, useWordPressApiConfig } from '@/hooks/use-wordpress-api';
import { ConfigForm } from '@/components/config-form';
import { CategoryList } from '@/components/category-list';
import { WordPressCategory } from '@/lib/api';

export default function CategoriesPage() {
  const { apiConfig } = useWordPressApiConfig();

  // Fetch categories
  const { 
    data: categories, 
    isLoading, 
    error 
  } = useWordPressApi<WordPressCategory[]>(
    '/wp/v2/categories',
    { per_page: '100' },
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Categories</h1>
        <p className="text-muted-foreground">
          Browse categories from your WordPress site
        </p>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p className="font-semibold">Error loading categories</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <CategoryList
          categories={categories || []}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}