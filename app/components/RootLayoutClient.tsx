'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar, Nav, Container, Button, Form, InputGroup, Dropdown, Row, Col } from 'react-bootstrap'


export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-light d-flex flex-column min-vh-100">
      <Container>
        <Navbar bg="light" expand="lg">
            <Link href="/" passHref legacyBehavior>
              <Navbar.Brand>
                <Image src="/palbin-logo.svg" alt="Logo" width={120} height={40} />
              </Navbar.Brand>
            </Link>

            <Button 
              variant="danger"
              size="sm"
              className="d-lg-none mx-2"
            >
              Empezar gratis
            </Button>

            <Navbar.Toggle aria-controls="navbar" />
            
            <Navbar.Collapse id="navbar">
              <Nav className="me-auto">
                <Nav.Link href="/precios" className="text-uppercase">Precios</Nav.Link>
                <Nav.Link href="/tour" className="text-uppercase">Características</Nav.Link>
                
                <Dropdown as={Nav.Item}>
                  <Dropdown.Toggle as={Nav.Link} className="text-uppercase">
                    Servicios
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="/servicios/seo360">SEO 360º</Dropdown.Item>
                    <Dropdown.Item href="/servicios/sem360">SEM 360º</Dropdown.Item>
                    <Dropdown.Item href="/servicios/cm360">RRSS 360º</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="/servicios">Todos los servicios</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Nav.Link href="/blog" className="text-uppercase">Blog</Nav.Link>

                <Dropdown as={Nav.Item} className="megamenu">
                  <Dropdown.Toggle as={Nav.Link} className="text-uppercase">
                    Más
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="p-4">
                    <Container>
                      <div className="row">
                        <div className="col-lg-3">
                          <h6 className="font-weight-bold text-uppercase">Soluciones</h6>
                          <Nav.Link href="/crear-tienda-online">Crear tienda online</Nav.Link>
                          <Nav.Link href="/crear-tienda-ropa">Crear tienda de ropa</Nav.Link>
                          <Nav.Link href="/dropshipping">Dropshipping</Nav.Link>
                        </div>
                        <div className="col-lg-3">
                          <h6 className="font-weight-bold text-uppercase">Plataforma</h6>
                          <Nav.Link href="/editor">Editor HTML</Nav.Link>
                          <Nav.Link href="/app">App móvil</Nav.Link>
                          <Nav.Link href="/express">Express</Nav.Link>
                        </div>
                      </div>
                    </Container>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>

              <Nav>
                <Button 
                  variant="primary"
                  size="sm"
                  className="d-none d-lg-inline-block mx-2"
                >
                  Empezar gratis
                </Button>

                <Nav.Link href="tel:901001814" className="d-none d-lg-block ms-3">
                  <i className="bi bi-telephone"></i> 901 001 814
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Container>
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
