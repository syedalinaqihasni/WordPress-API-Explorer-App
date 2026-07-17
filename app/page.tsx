'use client';

import { useState, useEffect } from 'react';
import { useWordPressApiConfig } from '@/hooks/use-wordpress-api';
import { ConfigForm } from '@/components/config-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Code, FileText, Github, Layers, Rss } from 'lucide-react';

export default function Home() {
  const { apiConfig } = useWordPressApiConfig();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!apiConfig ? (
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
              WordPress API Explorer
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect to any WordPress site and explore its API endpoints with this
              intuitive dashboard.
            </p>
          </div>
          
          <ConfigForm />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle>Content Browsing</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3">
                  Browse posts, pages, categories, and other content types from any WordPress site.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Code className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle>API Explorer</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3">
                  Explore all available API endpoints and test them with custom parameters.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Layers className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle>Modern UI</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3">
                  Beautiful, responsive interface with dark mode support and clean design.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
              Connected to WordPress
            </h1>
            <p className="text-lg text-muted-foreground">
              Your WordPress API is connected. Start exploring the content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/posts">
              <Card className="hover:shadow-md transition-all h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Browse all posts from your WordPress site
                  </p>
                </CardContent>
                <div className="px-6 pb-6">
                  <Button variant="outline" className="w-full group">
                    View Posts
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </Card>
            </Link>

            <Link href="/pages">
              <Card className="hover:shadow-md transition-all h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Pages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Browse all pages from your WordPress site
                  </p>
                </CardContent>
                <div className="px-6 pb-6">
                  <Button variant="outline" className="w-full group">
                    View Pages
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </Card>
            </Link>

            <Link href="/categories">
              <Card className="hover:shadow-md transition-all h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rss className="h-5 w-5" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Browse categories and their posts
                  </p>
                </CardContent>
                <div className="px-6 pb-6">
                  <Button variant="outline" className="w-full group">
                    View Categories
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </Card>
            </Link>

            <Link href="/explorer">
              <Card className="hover:shadow-md transition-all h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    API Explorer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Explore and test all available API endpoints
                  </p>
                </CardContent>
                <div className="px-6 pb-6">
                  <Button variant="outline" className="w-full group">
                    Open Explorer
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}