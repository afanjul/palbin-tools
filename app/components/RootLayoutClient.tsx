'use client'

import { Container, Row, Col } from 'react-bootstrap'
import MainNavbar from './MainNavbar'

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <MainNavbar />
      <div className="pt-5 pt-lg-6">
        {children}
      </div>
      <footer className="footer mt-auto py-3 bg-dark text-light">
        <Container className="text-center">
          <span>Made by Palbin.com with ❤️</span>
        </Container>
      </footer>
    </div>
  )
}
