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
    image: '/tool-images/invoice-generator.png',
    link: '/invoice-generator',
    buttonText: 'Crear Factura',
    buttonIcon: 'bi-file-earmark-text',
    buttonVariant: 'primary'
  },
  {
    id: 'instagram-grid-maker',
    title: 'Instagram Grid Maker',
    description: 'Create perfect carousel posts and grid layouts for your Instagram profile. Split any image into multiple slides or grid pieces with just a few clicks.',
    image: '/tool-images/instagram-grid-maker.png',
    link: '/instagram-grid-maker',
    buttonText: 'Create Grid',
    buttonIcon: 'bi-grid-3x3-gap',
    buttonVariant: 'danger'
  },
  {
    id: 'image-compressor',
    title: 'Image Compressor',
    description: 'Compress and optimize your images without losing quality. Perfect for web and social media use.',
    image: '/tool-images/image-compressor.png',
    link: '/image-compressor',
    buttonText: 'Compress Images',
    buttonIcon: 'bi-file-earmark-zip',
    buttonVariant: 'danger'
  },
  {
    id: 'thread-generator',
    title: 'Thread Generator',
    description: 'Transform your long-form content into engaging Twitter/X threads. AI-powered tool that maintains your message while optimizing for engagement.',
    image: '/tool-images/thread-generator.png',
    link: '/thread-generator',
    buttonText: 'Create Thread',
    buttonIcon: 'bi-chat-square-text',
    buttonVariant: 'danger'
  }
];
