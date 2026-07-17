import { formatDistance } from 'date-fns';

export type WordPressApiConfig = {
  baseUrl: string;
  endpoints?: string[];
};

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  isLoading: boolean;
};

// Common WordPress content types
export type WordPressPost = {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  categories: number[];
  tags: number[];
  _embedded?: any;
};

export type WordPressPage = Omit<WordPressPost, 'categories' | 'tags'> & {
  parent: number;
  menu_order: number;
};

export type WordPressCategory = {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
};

export type WordPressTag = Omit<WordPressCategory, 'parent'>;

export type WordPressMedia = {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  author: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: any;
  description: { rendered: string };
  caption: { rendered: string };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: any;
  post: number;
  source_url: string;
};

export type WordPressUser = {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: Record<string, string>;
};

export type WordPressComment = {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  author_url: string;
  date: string;
  date_gmt: string;
  content: { rendered: string };
  link: string;
  status: string;
  type: string;
  author_avatar_urls: Record<string, string>;
};

// Default common endpoints
export const defaultEndpoints = [
  '/wp/v2/posts',
  '/wp/v2/pages',
  '/wp/v2/categories',
  '/wp/v2/tags',
  '/wp/v2/media',
  '/wp/v2/users',
  '/wp/v2/comments',
];

// Fetch data from WordPress API
export async function fetchFromApi<T>(
  url: string,
  params: Record<string, string> = {}
): Promise<T> {
  try {
    const queryParams = new URLSearchParams(params);
    const fullUrl = `${url}${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;
    
    const response = await fetch(fullUrl);
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching from API:', error);
    throw error;
  }
}

// Detect WordPress API endpoints
export async function detectWordPressEndpoints(
  baseUrl: string
): Promise<string[]> {
  try {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      throw new Error(`Failed to access API at ${baseUrl}`);
    }
    
    const data = await response.json();
    const availableRoutes = data?.routes || {};
    
    return Object.keys(availableRoutes);
  } catch (error) {
    console.error('Error detecting WordPress endpoints:', error);
    return [];
  }
}

// Helper functions
export function stripHtmlTags(html: string): string {
  return html.replace(/<\/?[^>]+(>|$)/g, '');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function formatDateRelative(date: string): string {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
}

// Local storage helpers for API config
export function saveApiConfig(config: WordPressApiConfig): void {
  localStorage.setItem('wp_api_config', JSON.stringify(config));
}

export function getApiConfig(): WordPressApiConfig | null {
  const config = localStorage.getItem('wp_api_config');
  return config ? JSON.parse(config) : null;
}