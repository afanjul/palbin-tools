// Servicio para interactuar con SerpAPI para obtener resultados de búsqueda de Google
// Implementación usando la librería oficial de SerpAPI

import { getJson, config } from 'serpapi';

// Lista de dominios de Google disponibles para el selector
export const GOOGLE_DOMAINS = [
  { code: 'google.es', name: 'Google España (google.es)' },
  { code: 'google.com', name: 'Google Global (google.com)' },
  { code: 'google.co.uk', name: 'Google Reino Unido (google.co.uk)' },
  { code: 'google.fr', name: 'Google Francia (google.fr)' },
  { code: 'google.de', name: 'Google Alemania (google.de)' },
  { code: 'google.it', name: 'Google Italia (google.it)' },
  { code: 'google.com.mx', name: 'Google México (google.com.mx)' },
  { code: 'google.com.ar', name: 'Google Argentina (google.com.ar)' },
  { code: 'google.cl', name: 'Google Chile (google.cl)' },
  { code: 'google.com.co', name: 'Google Colombia (google.com.co)' },
];

class SerpApiService {
  constructor() {
    console.log("DEBUG: Using official SerpAPI JavaScript library");
  }

  /**
   * Realizar una búsqueda en Google usando SerpAPI y devolver las URLs
   * 
   * @param query La consulta de búsqueda (puede incluir comillas para coincidencia exacta)
   * @param numResults Número de resultados de búsqueda a recuperar (por defecto 100)
   * @param googleDomain Dominio de Google a usar para la búsqueda (por defecto google.com)
   * @returns Lista de URLs de los resultados de búsqueda
   */
  async searchGoogle(query: string, numResults: number = 100, googleDomain: string = "google.com"): Promise<string[]> {
    try {
      console.log(`DEBUG: Searching for '${query}' on ${googleDomain}`);

      // En el cliente, utilizamos nuestra API Route para no exponer la API key
      const params = new URLSearchParams({
        query,
        numResults: numResults.toString(),
        googleDomain
      });
      
      // Usar nuestra API Route que ya implementa la librería serpapi en el servidor
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/serp`;
      const response = await fetch(`${apiUrl}?${params.toString()}`);
      
      // Verificar primero si la respuesta es JSON válido
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`La respuesta no es JSON válido (${contentType}).`);
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${response.status} - ${errorData.error || response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(`API returned error: ${data.error || 'Unknown error'}`);
      }
      
      console.log(`DEBUG: Successfully found ${data.urls.length} URLs with SerpAPI`);
      return data.urls;
    } catch (error) {
      console.error(`ERROR: Failed to search with SerpAPI: ${error}`);
      throw error; // Propagar el error para manejarlo en la interfaz de usuario
    }
  }
}

// Crear una única instancia del servicio para reutilizar
const serpApiService = new SerpApiService();
export default serpApiService;
