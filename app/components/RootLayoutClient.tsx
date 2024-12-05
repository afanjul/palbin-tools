'use client'

import Link from 'next/link'
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-light d-flex flex-column min-vh-100">
        <Navbar expand="lg" bg="danger" variant="dark" className="mb-4">
          <Container>
            <Link href="/" passHref legacyBehavior>
              <Navbar.Brand>
                <i className="bi bi-grid-3x3-gap me-2"></i>
                Palbin.com Media Tools
              </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link 
                  href="https://github.com/afanjul/instagram-grid-maker" 
                  target="_blank"
                >
                  <i className="bi bi-github me-1"></i>
                  Palbin.com
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container className="py-4">
          <Row>
            <Col>
              {children}
            </Col>
          </Row>
        </Container>
        <footer className="footer mt-auto py-3 bg-dark text-light">
          <Container className="text-center">
            <span>Made by Palbin.com with ❤️</span>
          </Container>
        </footer>
      </body>
    </html>
  )
}
