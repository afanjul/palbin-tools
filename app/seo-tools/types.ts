// Tipos para el extractor de URLs
export interface GoogleDomain {
  code: string;
  name: string;
}

export interface ScrapedUrlResult {
  success: boolean;
  query: string;
  google_domain: string;
  urls: string[];
  count: number;
  message?: string;
}

// Tipos para el generador de blog
export interface AIModel {
  id: string;
  name: string;
}

export interface BlogGenerationResult {
  success: boolean;
  query: string;
  google_domain: string;
  blog_content: string;
  sources: { url: string; title: string }[];
  message?: string;
}

// Tipos para el extractor de contactos
export interface ContactExtractionSchema {
  type: string;
  properties: Record<string, { type: string }>;
}

export interface ContactExtractionInput {
  urls: string[];
  schema: ContactExtractionSchema;
  prompt: string;
  enableWebSearch: boolean;
  enableStreaming: boolean;
}

export interface ContactExtractionResult {
  success: boolean;
  results: ContactSingleResult[];
  error?: string;
}

export interface ContactSingleResult {
  url: string;
  [key: string]: unknown;
}

// Tipos para el filtro de URLs
export interface UrlFilterResult {
  success: boolean;
  filtered_urls: string[];
  errors: string[];
}

// Tipos para el manipulador de URLs
export interface UrlManipulationOptions {
  removeDuplicates?: boolean;
  sortUrls?: boolean;
  forceHttps?: boolean;
  removeWww?: boolean;
  removeParams?: boolean;
  forceTrailingSlash?: boolean;
  extractComponent?: 'domain' | 'path' | 'query' | 'subdirs' | 'full';
}

export interface UrlManipulationResult {
  success: boolean;
  urls: string[];
  errors: string[];
}
