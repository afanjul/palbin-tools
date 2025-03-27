'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap'
import { useEffect, useState } from 'react'

const baseUrl = "https://www.palbin.com/es";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function MainNavbar() {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`nav-menu menu-is-closed py-3${isScrolling ? ' is-scrolling' : ''}`}>
      <Container>
        <Navbar bg="light" expand="lg">
          <Link href="/" passHref legacyBehavior>
            <Navbar.Brand>
              <Image src={`${basePath}/images/palbin-logo.svg`} alt="Logo" width={120} height={40} />
            </Navbar.Brand>
          </Link>

          <Button 
            variant="danger"
            size="sm"
            className="d-lg-none mx-2 text-uppercase"
            href={`${baseUrl}/crear-tienda-online`}
          >
            Crear tienda
          </Button>

          <Navbar.Toggle aria-controls="navbar" />
          
          <Navbar.Collapse id="navbar">
            <Nav className="me-auto">
              <Nav.Link href={`${baseUrl}/precios`} className="text-uppercase">Precios</Nav.Link>
              <Nav.Link href={`${baseUrl}/tour`} className="text-uppercase">Características</Nav.Link>
              
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle as={Nav.Link} className="text-uppercase">
                  Servicios
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href={`${baseUrl}/servicios/seo360`} className="text-uppercase">SEO 360º</Dropdown.Item>
                  <Dropdown.Item href={`${baseUrl}/servicios/sem360`} className="text-uppercase">SEM 360º</Dropdown.Item>
                  <Dropdown.Item href={`${baseUrl}/servicios/cm360`} className="text-uppercase">RRSS 360º</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href={`${baseUrl}/servicios`} className="text-uppercase">Todos los servicios</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Nav.Link href={`${baseUrl}/blog`} className="text-uppercase">Blog</Nav.Link>

              <Dropdown as={Nav.Item} className="megamenu">
                <Dropdown.Toggle as={Nav.Link} className="text-uppercase">
                  Más
                </Dropdown.Toggle>
                <Dropdown.Menu className="p-4">
                  <Container>
                    <div className="row">
                      <div className="col-lg-3">
                        <h6 className="font-weight-bold text-uppercase">Soluciones</h6>
                        <Nav.Link href={`${baseUrl}/crear-tienda-online`} className="text-uppercase">Crear tienda online</Nav.Link>
                        <Nav.Link href={`${baseUrl}/crear-tienda-ropa`} className="text-uppercase">Crear tienda de ropa</Nav.Link>
                        <Nav.Link href={`${baseUrl}/dropshipping`} className="text-uppercase">Dropshipping</Nav.Link>
                      </div>
                      <div className="col-lg-3">
                        <h6 className="font-weight-bold text-uppercase">Plataforma</h6>
                        <Nav.Link href={`${baseUrl}/editor`} className="text-uppercase">Editor HTML</Nav.Link>
                        <Nav.Link href={`${baseUrl}/app`} className="text-uppercase">App móvil</Nav.Link>
                        <Nav.Link href={`${baseUrl}/express`} className="text-uppercase">Express</Nav.Link>
                      </div>
                    </div>
                  </Container>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>

            <Nav>
              <Button variant="primary" size="sm" className="d-none d-lg-inline mx-2 text-uppercase" href={`${baseUrl}/crear-tienda-online`}>
              Crear tienda
              </Button>
              <Nav.Link href="tel:901001814" className="d-none d-lg-block ms-3 text-uppercase">
                <i className="bi bi-telephone"></i> 901 001 814
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </div>
  )
} 