export interface Tool {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  buttonText: string;
  buttonIcon: string;
  buttonVariant: string;
}

export const tools: Tool[] = [
  {
    id: 'invoice-generator',
    title: 'Generador de Facturas',
    description: 'Crea facturas profesionales de forma rápida y sencilla. Guarda tus datos de empresa y genera facturas con cálculos automáticos.',
    image: '/images/tools/invoice-generator.png',
    link: '/invoice-generator',
    buttonText: 'Crear Factura',
    buttonIcon: 'bi-file-earmark-text',
    buttonVariant: 'primary'
  },
  {
    id: 'instagram-grid-maker',
    title: 'Instagram Grid Maker',
    description: 'Crea publicaciones de carrusel y diseños de cuadrícula perfectos para tu perfil de Instagram. Divide cualquier imagen en múltiples diapositivas o piezas de cuadrícula con solo unos pocos clics.',
    image: '/images/tools/instagram-grid-maker.png',
    link: '/instagram-grid-maker',
    buttonText: 'Create Grid',
    buttonIcon: 'bi-grid-3x3-gap',
    buttonVariant: 'danger'
  },
  {
    id: 'image-compressor',
    title: 'Image Compressor',
    description: 'Comprime y optimiza tus imágenes sin perder calidad. Perfecto para uso web y en redes sociales.',
    image: '/images/tools/image-compressor.png',
    link: '/image-compressor',
    buttonText: 'Compress Images',
    buttonIcon: 'bi-file-earmark-zip',
    buttonVariant: 'danger'
  },
  {
    id: 'thread-generator',
    title: 'Thread Generator',
    description: 'Transforma tu contenido extenso en atractivos hilos de Twitter/X. Herramienta impulsada por IA que mantiene tu mensaje mientras optimiza la participación.',
    image: '/images/tools/thread-generator.png',
    link: '/thread-generator',
    buttonText: 'Create Thread',
    buttonIcon: 'bi-chat-square-text',
    buttonVariant: 'danger'
  },
  {
    id: 'seo-tools',
    title: 'SEO Tools',
    description: 'Conjunto de herramientas para SEO y marketing de contenidos: extractor de URLs de SERPs, generador de artículos, extractor de contactos, filtrado y manipulación de URLs.',
    image: '/images/tools/seo-tools.png',
    link: '/seo-tools',
    buttonText: 'Usar Herramientas SEO',
    buttonIcon: 'bi-search',
    buttonVariant: 'success'
  }
];
