'use client';

import { useState } from 'react';
import { useWordPressApiConfig } from '@/hooks/use-wordpress-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ConfigForm() {
  const { apiConfig, setApiConfig, detectEndpoints, isDetecting, error } = useWordPressApiConfig();
  const [baseUrl, setBaseUrl] = useState<string>(apiConfig?.baseUrl || '');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!baseUrl) {
      toast({
        title: 'Error',
        description: 'Please enter a WordPress API URL',
        variant: 'destructive',
      });
      return;
    }

    // Normalize URL
    let normalizedUrl = baseUrl;
    if (!normalizedUrl.endsWith('/wp-json')) {
      normalizedUrl = normalizedUrl.endsWith('/') 
        ? `${normalizedUrl}wp-json` 
        : `${normalizedUrl}/wp-json`;
    }

    try {
      const endpoints = await detectEndpoints(normalizedUrl);
      
      setApiConfig({
        baseUrl: normalizedUrl,
        endpoints,
      });
      
      toast({
        title: 'Success',
        description: `Connected to WordPress API at ${normalizedUrl}`,
      });
    } catch (err) {
      toast({
        title: 'Connection Error',
        description: err instanceof Error ? err.message : 'Failed to connect to the API',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>WordPress API Configuration</CardTitle>
        <CardDescription>
          Enter the base URL of your WordPress site to connect to its API
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="baseUrl"
              placeholder="https://example.com/wp-json"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Enter the URL of your WordPress site. The /wp-json path will be added automatically if missing.
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button type="submit" className="w-full" disabled={isDetecting}>
            {isDetecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Detecting Endpoints...
              </>
            ) : (
              'Connect to WordPress API'
            )}
          </Button>
        </form>
      </CardContent>
      {apiConfig && (
        <CardFooter className="flex flex-col items-start border-t pt-4">
          <p className="text-sm font-medium">Current Configuration:</p>
          <p className="text-sm text-muted-foreground break-all">{apiConfig.baseUrl}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {apiConfig.endpoints?.length || 0} endpoints detected
          </p>
        </CardFooter>
      )}
    </Card>
  );
}