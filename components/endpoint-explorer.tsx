'use client';

import { useState } from 'react';
import { useWordPressApiConfig } from '@/hooks/use-wordpress-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function EndpointExplorer() {
  const { apiConfig } = useWordPressApiConfig();
  const [endpoint, setEndpoint] = useState<string>('');
  const [customEndpoint, setCustomEndpoint] = useState<string>('');
  const [params, setParams] = useState<string>('');
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEndpoint = async () => {
    if (!apiConfig?.baseUrl) {
      toast({
        title: 'Error',
        description: 'Please configure the WordPress API first',
        variant: 'destructive',
      });
      return;
    }

    const targetEndpoint = endpoint || customEndpoint;
    if (!targetEndpoint) {
      toast({
        title: 'Error',
        description: 'Please select or enter an endpoint',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Parse params string into object
      const paramsObject: Record<string, string> = {};
      if (params.trim()) {
        params.split('&').forEach((param) => {
          const [key, value] = param.split('=');
          if (key && value) {
            paramsObject[key.trim()] = value.trim();
          }
        });
      }

      // Build URL
      const url = new URL(targetEndpoint.startsWith('/') 
        ? `${apiConfig.baseUrl}${targetEndpoint}`
        : `${apiConfig.baseUrl}/${targetEndpoint}`);
      
      // Add params to URL
      Object.entries(paramsObject).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });

      const res = await fetch(url.toString());
      
      if (!res.ok) {
        throw new Error(`API request failed with status: ${res.status}`);
      }
      
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to fetch data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!apiConfig) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API Not Configured</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please configure the WordPress API first</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>WordPress API Explorer</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="predefined">
            <TabsList className="mb-4">
              <TabsTrigger value="predefined">Predefined Endpoints</TabsTrigger>
              <TabsTrigger value="custom">Custom Endpoint</TabsTrigger>
            </TabsList>
            <TabsContent value="predefined" className="space-y-4">
              <Select onValueChange={setEndpoint}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an endpoint" />
                </SelectTrigger>
                <SelectContent>
                  {apiConfig.endpoints?.map((ep) => (
                    <SelectItem key={ep} value={ep}>
                      {ep}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TabsContent>
            <TabsContent value="custom" className="space-y-4">
              <Input
                placeholder="Enter custom endpoint (e.g., /wp/v2/posts)"
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
              />
            </TabsContent>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">
                  Query Parameters (optional)
                </label>
                <Input
                  placeholder="param1=value1&param2=value2"
                  value={params}
                  onChange={(e) => setParams(e.target.value)}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Format: param1=value1&param2=value2
                </p>
              </div>
              <Button onClick={fetchEndpoint} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Fetch Data'
                )}
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md overflow-auto max-h-[500px]">
              <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}