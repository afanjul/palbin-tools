import './styles/globals.css';
import RootLayoutClient from './components/RootLayoutClient'

// Metadata for the app
export const metadata = {
  title: 'Herramientas para Social Media - By Palbin.com',
  description: 'Usa nuestras herramientas para crear contenido de calidad para tus redes sociales.',
}

// Server component wrapper
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css" />
      </head>
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  )
}