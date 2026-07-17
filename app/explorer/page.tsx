'use client';

import { useState } from 'react';
import { useWordPressApiConfig } from '@/hooks/use-wordpress-api';
import { ConfigForm } from '@/components/config-form';
import { EndpointExplorer } from '@/components/endpoint-explorer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ExplorerPage() {
  const { apiConfig } = useWordPressApiConfig();
  const [tab, setTab] = useState<string>('explorer');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">API Explorer</h1>
        <p className="text-muted-foreground">
          Explore and test WordPress API endpoints
        </p>
      </div>

      <Tabs defaultValue={tab} onValueChange={setTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="explorer">Endpoint Explorer</TabsTrigger>
          <TabsTrigger value="config">API Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="explorer" className="focus-visible:outline-none focus-visible:ring-0">
          {!apiConfig ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-6">
                Please configure the WordPress API first
              </p>
              <ConfigForm />
            </div>
          ) : (
            <EndpointExplorer />
          )}
        </TabsContent>
        
        <TabsContent value="config" className="focus-visible:outline-none focus-visible:ring-0">
          <ConfigForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}