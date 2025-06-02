// Servicio para interactuar con APIs externas (SERP, OpenRouter, Firecrawl)

import { 
  ScrapedUrlResult, 
  BlogGenerationResult, 
  ContactExtractionResult, 
  ContactExtractionInput, 
  UrlFilterResult, 
  UrlManipulationOptions, 
  UrlManipulationResult 
} from '../types';

// Importar los servicios implementados
import serpApiService, { GOOGLE_DOMAINS } from './serpApiService';
import firecrawlService from './firecrawlService';
import openRouterService from './openRouterService';

// Tipos para las entradas/salidas de los servicios API
export interface UrlScraperInput {
  query: string;
  numResults: number;
  googleDomain: string;
}

export interface UrlScraperOutput {
  urls: string[];
}

export interface UrlFilterInput {
  urls: string[];
  condition: 'incluye' | 'no_incluye';
  filterText: string;
}

export interface UrlFilterOutput {
  filteredUrls: string[];
}

export interface ContactExtractorInput {
  urls: string[];
  prompt: string;
  schema: Record<string, unknown>;
  enableWebSearch: boolean;
}

export interface ContactExtractorOutput {
  extractedInfo: Record<string, unknown>[];
}

export interface BlogGeneratorInput {
  topic: string;
  urls: string[];
  aiModel: string;
}

export interface BlogGeneratorOutput {
  content: string;
}

export interface UrlManipulatorInput {
  urls: string[];
  operations: {
    removeParams: boolean;
    forceHttps: boolean;
    removeWww: boolean;
    enforceTrailingSlash: boolean;
    removeTrailingSlash: boolean;
  };
}

export interface UrlManipulatorOutput {
  manipulatedUrls: string[];
}

class ApiService {
  /**
   * Extrae URLs desde resultados de búsqueda de Google
   */
  async extractUrls(input: UrlScraperInput): Promise<UrlScraperOutput> {
    const { query, numResults, googleDomain } = input;
    
    try {
      // Usar el servicio SerpAPI para extraer urls de Google
      const urls = await serpApiService.searchGoogle(query, numResults, googleDomain);
      
      return { urls };
    } catch (error) {
      console.error("Error extracting URLs:", error);
      throw error;
    }
  }
  
  /**
   * Filtra URLs basado en si contienen o no cierto texto en su contenido
   */
  async filterUrls(input: UrlFilterInput): Promise<UrlFilterOutput> {
    const { urls, condition, filterText } = input;
    
    try {
      if (!urls || urls.length === 0 || !filterText) {
        return { filteredUrls: [] };
      }
      
      // Obtener el contenido de todas las URLs
      const batchResult = await firecrawlService.batchScrape(urls);
      
      if (!batchResult.success || !batchResult.data) {
        throw new Error("Failed to scrape URLs content");
      }
      
      // Filtrar basado en la condición (incluye/no incluye)
      const filteredUrls = urls.filter((url, index) => {
        const scrapedContent = batchResult.data[index];
        
        if (!scrapedContent || !scrapedContent.content) {
          return false;
        }
        
        const contentLower = scrapedContent.content.toLowerCase();
        const filterTextLower = filterText.toLowerCase();
        
        if (condition === 'incluye') {
          return contentLower.includes(filterTextLower);
        } else {
          return !contentLower.includes(filterTextLower);
        }
      });
      
      return { filteredUrls };
    } catch (error) {
      console.error("Error filtering URLs:", error);
      throw error;
    }
  }
  
  /**
   * Extrae información de contacto de múltiples URLs
   */
  async extractContactInfo(input: ContactExtractorInput): Promise<ContactExtractorOutput> {
    try {
      const { urls, prompt, schema, enableWebSearch } = input;
      
      // Verificar que las URLs son válidas
      if (!urls || urls.length === 0) {
        throw new Error("No se han proporcionado URLs para extraer la información de contacto");
      }
      
      // Usar el servicio de Firecrawl para extraer la info
      // Adaptamos la llamada para usar la implementación oficial de Firecrawl que ahora usa Zod
      const extractedInfo = await firecrawlService.extractContactInfo(
        urls,
        prompt,
        schema,
        enableWebSearch
      );
      
      return { extractedInfo };
    } catch (error) {
      console.error("Error extracting contact info:", error);
      throw error;
    }
  }
  
  /**
   * Genera contenido para un blog basado en un tema y urls relacionadas
   */
  async generateBlogContent(input: BlogGeneratorInput): Promise<BlogGeneratorOutput> {
    try {
      const { topic, urls, aiModel } = input;
      
      // Verificar entrada
      if (!topic) {
        throw new Error("Se requiere un tema para generar el contenido del blog");
      }
      
      if (!urls || urls.length === 0) {
        throw new Error("Se requieren URLs para extraer contenido fuente");
      }
      
      // Primero obtener contenido de las URLs usando el método actualizado de batchScrape
      const batchResult = await firecrawlService.batchScrape(urls);
      
      if (!batchResult.success || !batchResult.data) {
        throw new Error("Error al extraer el contenido de las URLs para la generación del blog");
      }
      
      // Adaptar el formato de los datos para mantener compatibilidad con OpenRouter
      const contentData = batchResult.data.map(item => ({
        title: item.title || "",
        content: item.content || "",
        url: item.url
      }));
      
      // Usar OpenRouter para generar el contenido
      const blogContent = await openRouterService.generateBlogContent(topic, contentData, aiModel);
      
      return { content: blogContent };
    } catch (error) {
      console.error("Error generating blog content:", error);
      throw error;
    }
  }
  
  /**
   * Manipula URLs aplicando varias transformaciones
   */
  async manipulateUrls(input: UrlManipulatorInput): Promise<UrlManipulatorOutput> {
    try {
      const { urls, operations } = input;
      
      // Verificar entrada
      if (!urls || urls.length === 0) {
        throw new Error("Se requieren URLs para manipular");
      }
      
      const manipulatedUrls = urls.map(url => {
        let processedUrl = url;
        
        try {
          // Crear un objeto URL para manipularlo fácilmente
          let urlObj = new URL(processedUrl);
          
          // Forzar HTTPS
          if (operations.forceHttps) {
            urlObj.protocol = 'https:';
          }
          
          // Eliminar www
          if (operations.removeWww) {
            urlObj.hostname = urlObj.hostname.replace(/^www\./, '');
          }
          
          // Remover parámetros de la URL
          if (operations.removeParams) {
            urlObj.search = '';
          }
          
          // Convertir de vuelta a string
          processedUrl = urlObj.toString();
          
          // Gestión de slashes finales
          if (operations.enforceTrailingSlash && !urlObj.pathname.endsWith('/')) {
            processedUrl = processedUrl + '/';
          } else if (operations.removeTrailingSlash && urlObj.pathname.endsWith('/')) {
            processedUrl = processedUrl.replace(/\/$/, '');
          }
          
          return processedUrl;
        } catch (e) {
          console.error(`Error manipulating URL ${url}:`, e);
          throw new Error(`URL no válida: ${url}`);
        }
      });
      
      return { manipulatedUrls };
    } catch (error) {
      console.error("Error in URL manipulation:", error);
      throw error;
    }
  }
}

// Crear una única instancia del servicio para reutilizar
const apiService = new ApiService();
export default apiService;

// Export named functions for easier imports
export const filterUrls = async (
  urls: string[], 
  includeKeywords: string[], 
  excludeKeywords: string[]
): Promise<UrlFilterResult> => {
  // Process the URLs with include and exclude filters
  try {
    const filteredUrls: string[] = [];
    const errors: string[] = [];
    
    for (const url of urls) {
      try {
        // For now, we'll do a simple implementation
        // In a real implementation, you'd scrape the content and filter
        let shouldInclude = true;
        
        // Simple URL-based filtering (placeholder logic)
        if (includeKeywords.length > 0) {
          shouldInclude = includeKeywords.some(keyword => 
            url.toLowerCase().includes(keyword.toLowerCase())
          );
        }
        
        if (shouldInclude && excludeKeywords.length > 0) {
          shouldInclude = !excludeKeywords.some(keyword => 
            url.toLowerCase().includes(keyword.toLowerCase())
          );
        }
        
        if (shouldInclude) {
          filteredUrls.push(url);
        }
      } catch (error) {
        errors.push(`Error processing ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return {
      success: true,
      filtered_urls: filteredUrls,
      errors
    };
  } catch (error) {
    return {
      success: false,
      filtered_urls: [],
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
};

export const manipulateUrls = async (
  urls: string[], 
  options: UrlManipulationOptions
): Promise<UrlManipulationResult> => {
  try {
    let processedUrls = [...urls];
    const errors: string[] = [];
    
    // Remove duplicates if requested
    if (options.removeDuplicates) {
      processedUrls = [...new Set(processedUrls)];
    }
    
    // Process each URL
    const manipulatedUrls = processedUrls.map(url => {
      try {
        let processedUrl = url.trim();
        
        if (!processedUrl) return processedUrl;
        
        // Add protocol if missing
        if (!processedUrl.match(/^https?:\/\//)) {
          processedUrl = 'https://' + processedUrl;
        }
        
        const urlObj = new URL(processedUrl);
        
        // Force HTTPS
        if (options.forceHttps) {
          urlObj.protocol = 'https:';
        }
        
        // Remove www
        if (options.removeWww) {
          urlObj.hostname = urlObj.hostname.replace(/^www\./, '');
        }
        
        // Remove parameters
        if (options.removeParams) {
          urlObj.search = '';
          urlObj.hash = '';
        }
        
        // Handle trailing slash
        if (options.forceTrailingSlash && !urlObj.pathname.endsWith('/')) {
          urlObj.pathname += '/';
        }
        
        // Extract specific component if requested
        if (options.extractComponent) {
          switch (options.extractComponent) {
            case 'domain':
              return urlObj.hostname;
            case 'path':
              return urlObj.pathname;
            case 'query':
              return urlObj.search;
            case 'subdirs':
              return urlObj.pathname.split('/').slice(1, -1).join('/');
            default:
              break;
          }
        }
        
        return urlObj.toString();
      } catch (error) {
        errors.push(`Invalid URL: ${url}`);
        return url; // Return original URL if processing fails
      }
    });
    
    // Sort if requested
    if (options.sortUrls) {
      manipulatedUrls.sort();
    }
    
    return {
      success: true,
      urls: manipulatedUrls,
      errors
    };
  } catch (error) {
    return {
      success: false,
      urls: [],
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
};
