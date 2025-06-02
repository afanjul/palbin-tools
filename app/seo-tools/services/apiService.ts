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
  schema: any;
  enableWebSearch: boolean;
}

export interface ContactExtractorOutput {
  extractedInfo: any[];
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
