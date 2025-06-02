// Servicio para interactuar con Firecrawl para scraping de sitios web
// Implementado usando la biblioteca oficial de Firecrawl

import FirecrawlApp from "@mendable/firecrawl-js";
import { z } from "zod";

// Definición de tipos para la aplicación
interface ScrapedContent {
  content: string;
  html: string;
  title: string;
  url: string;
  [key: string]: any;
}

interface BatchScrapeResult {
  data: ScrapedContent[];
  success: boolean;
  error?: string;
}

interface ExtractedInfo {
  url: string;
  data?: Record<string, any>;
  [key: string]: any;
}

// Schema por defecto para extracción de contactos usando Zod
export const DEFAULT_EXTRACTION_SCHEMA = z.object({
  shop_phone: z.string().optional(),
  contact_email: z.string().optional(),
  whatsapp: z.string().optional(),
  contact_page_url: z.string().optional(),
  facebook_url: z.string().optional(),
  instagram_url: z.string().optional(),
  twitter_url: z.string().optional(),
  linkedin_url: z.string().optional(),
  tiktok_url: z.string().optional(),
  youtube_url: z.string().optional(),
  has_contact_form: z.boolean().optional(),
  additional_notes: z.string().optional()
});

// Prompt por defecto para extracción de contactos
export const DEFAULT_EXTRACTION_PROMPT = `
Tu tarea es encontrar y extraer información de contacto y redes sociales de esta página web. 
Busca números de teléfono, direcciones de correo electrónico, enlaces a formularios de contacto, 
WhatsApp y perfiles de redes sociales.

Para cada uno de los elementos que encuentres:
- shop_phone: Número de teléfono principal (formato internacional preferido)
- contact_email: Dirección de correo electrónico de contacto
- whatsapp: Número de WhatsApp si está disponible
- contact_page_url: URL a la página de contacto
- facebook_url, instagram_url, twitter_url, linkedin_url, tiktok_url, youtube_url: URLs a perfiles en redes sociales
- has_contact_form: true/false si detectas un formulario de contacto
- additional_notes: Cualquier información adicional relevante sobre cómo contactar

No inventes información. Si no encuentras algún dato, déjalo en blanco.
Para perfiles sociales, asegúrate de que pertenecen realmente a la empresa/sitio web.
Extrae las URLs completas, incluyendo https://.
`;

class FirecrawlService {
  private apiClient: FirecrawlApp | null = null;
  
  constructor() {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    
    if (apiKey) {
      this.apiClient = new FirecrawlApp({
        apiKey: apiKey
      });
      console.log("FirecrawlService: Initialized with official Firecrawl library");
    } else {
      console.warn('FirecrawlService: No API key provided. Service will use mock data.');
    }
  }
  
  /**
   * Obtiene contenido de múltiples URLs en batch
   * 
   * @param urls Lista de URLs para hacer scraping
   * @returns Los datos scrapeados con el contenido estructurado
   */
  async batchScrape(urls: string[]): Promise<BatchScrapeResult> {
    try {
      if (!this.apiClient) {
        throw new Error("Firecrawl API key no configurada. Por favor, configura la variable de entorno FIRECRAWL_API_KEY.");
      }
      
      if (!urls || urls.length === 0) {
        throw new Error("No se han proporcionado URLs para hacer scraping");
      }
      
      // Usamos el método extract de la API oficial con un prompt simple
      // que solicita el contenido completo de la página
      const prompt = "Extrae el contenido completo de esta página web, incluyendo el título.";
      
      // Promise.all para procesar todas las URLs en paralelo (una por una)
      const results: ScrapedContent[] = [];
      
      for (const url of urls) {
        try {
          // Extraer el contenido usando la API de Firecrawl
          const response = await this.apiClient!.extract([url], {
            prompt: prompt
          });
          
          if (response.success && response.data) {
            // Añadimos el resultado transformando la respuesta al formato esperado
            results.push({
              content: typeof response.data === 'string' 
                ? response.data 
                : JSON.stringify(response.data),
              html: "",  // La API extract no devuelve HTML directamente
              title: url.split('/').pop() || url,  // Usamos parte de la URL como título
              url: url
            });
          } else {
            throw new Error(response.error || "Error desconocido");
          }
        } catch (error) {
          console.error(`Error al hacer scraping de ${url}:`, error);
          // Añadimos un resultado vacío para mantener la correspondencia con las URLs
          results.push({
            content: "",
            html: "",
            title: `Error: No se pudo procesar ${url}`,
            url: url
          });
        }
      }
      
      return {
        success: true,
        data: results
      };
      
    } catch (error) {
      console.error('Error en batchScrape:', error);
      throw error;
    }
  }
  
  /**
   * Extrae información de contacto de múltiples URLs usando la API oficial
   * 
   * @param urls Lista de URLs para extraer información
   * @param prompt Prompt personalizado para la extracción (opcional)
   * @param schema Schema de extracción personalizado (opcional)
   * @param enableWebSearch Habilitar búsqueda web para mejorar resultados (opcional)
   * @returns Información extraída para cada URL
   */
  async extractContactInfo(
    urls: string[], 
    prompt: string = DEFAULT_EXTRACTION_PROMPT,
    customSchema: any = DEFAULT_EXTRACTION_SCHEMA,
    enableWebSearch: boolean = false
  ): Promise<ExtractedInfo[]> {
    try {
      if (!this.apiClient) {
        throw new Error("Firecrawl API key no configurada. Por favor, configura la variable de entorno FIRECRAWL_API_KEY.");
      }
      
      if (!urls || urls.length === 0) {
        throw new Error("No se han proporcionado URLs para extraer información.");
      }
      
      // Array para almacenar los resultados de extracción
      const results: ExtractedInfo[] = [];
      
      // Procesar cada línea (que puede contener múltiples URLs separadas por comas)
      for (const line of urls) {
        try {
          // Dividir la línea en un array de URLs, eliminando espacios en blanco
          const urlArray = line.split(',').map(url => url.trim());
          
          // Verificar que hay al menos una URL válida
          if (urlArray.length === 0 || !urlArray[0]) {
            console.warn("Línea sin URLs válidas:", line);
            continue;
          }
          
          // Almacenar la primera URL como la principal para mostrar en los resultados
          const mainUrl = urlArray[0];
          
          // Realizar la extracción usando el array completo de URLs en una sola llamada
          const extractionResult = await this.apiClient!.extract(urlArray, {
            prompt: prompt,
            schema: customSchema,
            enableWebSearch: enableWebSearch
          });
          
          // Verificar si la extracción fue exitosa
          if (extractionResult.success && extractionResult.data) {
            // Crear objeto de resultado asociando los datos extraídos con la URL principal
            const result: ExtractedInfo = {
              url: mainUrl,
              ...extractionResult.data
            };
            
            // Añadir al array de resultados
            results.push(result);
          } else {
            // Si hay un error, añadir un resultado vacío para mantener la correspondencia
            console.error("Error en la extracción para la línea:", line, extractionResult.error);
            results.push({
              url: mainUrl,
              error: extractionResult.error || "Error desconocido en la extracción"
            });
          }
        } catch (error) {
          // Si hay una excepción, añadir un resultado vacío para mantener la correspondencia
          console.error("Excepción procesando línea:", line, error);
          results.push({
            url: line.split(',')[0].trim(),
            error: error instanceof Error ? error.message : "Error desconocido"
          });
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error en extractContactInfo:', error);
      throw error; // Propagar el error para manejarlo en la interfaz de usuario
    }
  }
}

// Crear una única instancia del servicio para reutilizar
const firecrawlService = new FirecrawlService();
export default firecrawlService;
