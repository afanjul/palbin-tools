import './globals.css'

export const metadata = {
  title: 'Instagram Grid Maker',
  description: 'Create and customize your Instagram grid layout',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
