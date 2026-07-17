'use client';

import { useState, useEffect } from 'react';
import {
  WordPressApiConfig,
  ApiResponse,
  fetchFromApi,
  detectWordPressEndpoints,
  defaultEndpoints,
  getApiConfig,
  saveApiConfig,
} from '@/lib/api';

export function useWordPressApi<T>(
  endpoint: string,
  params: Record<string, string> = {},
  enabled = true
): ApiResponse<T> & { refetch: () => Promise<void> } {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiConfig, setApiConfig] = useState<WordPressApiConfig | null>(null);

  // Load API config from localStorage
  useEffect(() => {
    const savedConfig = getApiConfig();
    if (savedConfig) {
      setApiConfig(savedConfig);
    }
  }, []);

  const fetchData = async () => {
    if (!apiConfig?.baseUrl || !enabled) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const fullEndpoint = `${apiConfig.baseUrl}${endpoint}`;
      const result = await fetchFromApi<T>(fullEndpoint, params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when endpoint or params change
  useEffect(() => {
    if (apiConfig?.baseUrl) {
      fetchData();
    }
  }, [endpoint, JSON.stringify(params), apiConfig, enabled]);

  const refetch = async () => {
    await fetchData();
  };

  return { data, error, isLoading, refetch };
}

export function useWordPressApiConfig(): {
  apiConfig: WordPressApiConfig | null;
  setApiConfig: (config: WordPressApiConfig) => void;
  detectEndpoints: (baseUrl: string) => Promise<string[]>;
  isDetecting: boolean;
  error: string | null;
} {
  const [apiConfig, setApiConfigState] = useState<WordPressApiConfig | null>(null);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load API config from localStorage
  useEffect(() => {
    const savedConfig = getApiConfig();
    if (savedConfig) {
      setApiConfigState(savedConfig);
    }
  }, []);

  const setApiConfig = (config: WordPressApiConfig) => {
    saveApiConfig(config);
    setApiConfigState(config);
  };

  const detectEndpoints = async (baseUrl: string): Promise<string[]> => {
    setIsDetecting(true);
    setError(null);
    
    try {
      const endpoints = await detectWordPressEndpoints(baseUrl);
      if (endpoints.length === 0) {
        // If no endpoints detected, use default ones
        setError('No endpoints detected. Using default WordPress endpoints.');
        return defaultEndpoints;
      }
      return endpoints;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to detect endpoints');
      return [];
    } finally {
      setIsDetecting(false);
    }
  };

  return { 
    apiConfig, 
    setApiConfig, 
    detectEndpoints, 
    isDetecting, 
    error 
  };
}