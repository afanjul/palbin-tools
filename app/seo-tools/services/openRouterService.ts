// Servicio para interactuar con OpenRouter para generar contenido con IA
// Implementación con la biblioteca oficial @openrouter/ai-sdk-provider

import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';

// Lista de modelos disponibles para mostrar en la interfaz
export const AI_MODELS = [
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'openai/gpt-4o', name: 'GPT-4o' },
  { id: 'anthropic/claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus' },
  { id: 'meta-llama/llama-3-70b-instruct', name: 'Llama 3 70B' }
];

class OpenRouterService {
  private openrouterClient: ReturnType<typeof createOpenRouter> | null = null;

  constructor() {
    // Obtener la API key de las variables de entorno
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (apiKey) {
      this.openrouterClient = createOpenRouter({ 
        apiKey,
        // Headers requeridos por OpenRouter
        headers: {
          'HTTP-Referer': 'https://palbin.com',
          'X-Title': 'Palbin Tools'
        }
      });
      console.log('DEBUG: OpenRouter client initialized with official library');
    } else {
      console.warn('WARN: OpenRouter API key is not configured. Service will use fallback mode.');
    }
  }

  /**
   * Genera contenido de blog basado en un tema y contenido fuente usando IA
   * 
   * @param topic El tema principal o título del blog
   * @param sourceContent Contenido fuente para inspirar la generación
   * @param model Modelo de IA a usar (por defecto 'openai/gpt-3.5-turbo')
   * @returns Contenido de blog generado
   */
  async generateBlogContent(
    topic: string, 
    sourceContent: Array<{title: string; content: string; url: string}> | string,
    modelId: string = 'openai/gpt-3.5-turbo'
  ): Promise<string> {
    try {
      if (!this.openrouterClient) {
        throw new Error('OpenRouter API key no configurada. Por favor, configura la variable de entorno OPENROUTER_API_KEY.');
      }

      console.log(`DEBUG: Generating blog content for topic: ${topic} using model: ${modelId}`);
      
      // Construir el prompt para la generación
      const systemMessage = `
      Eres un experto redactor de contenido SEO. Tu tarea es crear un artículo completo sobre el tema 
      proporcionado utilizando la información de las fuentes dadas. El artículo debe:
      
      1. Tener una estructura clara con introducción, desarrollo y conclusión
      2. Incluir un título atractivo H1
      3. Usar subtítulos H2 y H3 apropiados
      4. Contener entre 800-1200 palabras
      5. Estar optimizado para SEO pero ser natural y atractivo para lectores humanos
      6. Incluir datos específicos de las fuentes proporcionadas
      7. El texto debe estar en español
      
      Formato del contenido:
      - Usa markdown para el formato
      - Utiliza # para H1, ## para H2, ### para H3
      - Usa **negrita** para términos importantes
      - Incluye listas con puntos cuando sea apropiado
      `;

      // Formatear las fuentes de contenido
      let formattedSources: string;
      if (typeof sourceContent === 'string') {
        formattedSources = sourceContent;
      } else {
        // Es un array de objetos con título, contenido y URL
        formattedSources = sourceContent.map(source => 
          `Título: ${source.title}\nURL: ${source.url}\nContenido: ${source.content}`
        ).join('\n---\n');
      }
      
      const userPrompt = `
      Tema: ${topic}
      
      Fuentes:
      ${formattedSources}
      
      Por favor, genera un artículo completo en español siguiendo las instrucciones.
      `;

      // Usar la biblioteca AI SDK con OpenRouter
      const model = this.openrouterClient(modelId);
      
      const { text } = await generateText({
        model,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userPrompt }
        ],
        maxTokens: 2500 // Ajustado para generar un artículo completo
      });

      return text;
    } catch (error) {
      console.error('Error generating blog content:', error);
      throw error;
    }
  }
}

// Crear una única instancia del servicio para reutilizar
const openRouterService = new OpenRouterService();
export default openRouterService;
