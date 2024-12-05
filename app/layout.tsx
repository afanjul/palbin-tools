import './globals.css'
import RootLayoutClient from './components/RootLayoutClient'

// Metadata for the app
export const metadata = {
  title: 'Instagram Grid Maker',
  description: 'Create and customize your Instagram grid layout',
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
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css" />
      </head>
      <RootLayoutClient>
        {children}
      </RootLayoutClient>
    </html>
  )
}
