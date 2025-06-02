import { NextResponse } from 'next/server';
import { getJson } from 'serpapi';

// Mapeo de dominios de Google a códigos de país (según la documentación de SerpAPI)
const DOMAIN_TO_COUNTRY: Record<string, string> = {
  "google.com": "us",
  "google.es": "es",
  "google.co.uk": "uk",
  "google.com.mx": "mx",
  "google.com.ar": "ar",
  "google.cl": "cl",
  "google.com.co": "co",
  "google.com.br": "br",
  "google.de": "de",
  "google.fr": "fr",
  "google.it": "it"
};

export async function GET(request: Request) {
  try {
    // Obtener los parámetros de búsqueda de la URL
    const url = new URL(request.url);
    const query = url.searchParams.get('query');
    const numResults = parseInt(url.searchParams.get('numResults') || '100');
    const googleDomain = url.searchParams.get('googleDomain') || 'google.com';
    
    if (!query) {
      return NextResponse.json({ error: 'El parámetro query es obligatorio' }, { status: 400 });
    }
    
    // Obtener API key de las variables de entorno del servidor
    const apiKey = process.env.SERPAPI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key no configurada en el servidor' }, { status: 500 });
    }
    
    // Determinar el código de país a partir del dominio
    let countryCode = "us";  // Por defecto
    const baseDomain = googleDomain.replace("www.", "");
    if (baseDomain in DOMAIN_TO_COUNTRY) {
      countryCode = DOMAIN_TO_COUNTRY[baseDomain];
    }
    
    console.log(`[SerpAPI] Searching for '${query}' on ${googleDomain} (country: ${countryCode})`);
    
    try {
      // Usar la librería oficial según la documentación
      const data = await getJson({
        engine: "google",
        api_key: apiKey,
        q: query,
        google_domain: baseDomain,
        gl: countryCode,
        hl: countryCode,
        num: Math.min(100, numResults) // Google tiene un máximo de 100 resultados por página
      });
      
      // Extraer las URLs de los resultados orgánicos
      const urls: string[] = [];
      
      if (data.organic_results) {
        for (const result of data.organic_results) {
          if (result.link) {
            urls.push(result.link);
            
            // Salir si hemos alcanzado el número deseado de resultados
            if (urls.length >= numResults) {
              break;
            }
          }
        }
      }
      
      return NextResponse.json({ 
        success: true,
        urls,
        count: urls.length
      });
      
    } catch (error) {
      console.error('[SerpAPI] Error:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Error desconocido en la API de SERP' 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('[SerpAPI] Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Error desconocido en la API de SERP' 
    }, { status: 500 });
  }
}
