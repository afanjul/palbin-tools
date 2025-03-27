'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap'
import { useEffect, useState } from 'react'

const baseUrl = "https://www.palbin.com/es";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function MainNavbar() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [megamenuImage, setMegamenuImage] = useState('https://cdn.palbincdn.com/productwebThemes/rehome/images/more-nav-megamenu.svg');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`nav-menu fixed-top menu-is-closed py-3${isScrolling ? ' is-scrolling' : ' is-not-scrolling'}`}>
      <Container>
        <Navbar bg="light" expand="lg">
          <Link href="/" passHref legacyBehavior>
            <Navbar.Brand>
              <Image src={`${basePath}/images/palbin-logo.svg`} alt="Logo" width={120} height={29} />
            </Navbar.Brand>
          </Link>

          <Button 
            type="submit"
            id="w0"
            className="navbar-btn-cta cta-for-mobile btn-cta ms-auto me-2 d-lg-none btn-sm text-uppercase px-2 btn btn-primary"
            href="https://www.palbin.com/es/crear-tienda-online"
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
                <Dropdown.Menu className="p-0 m-0">
                  <div className="row bg-white m-0">
                    <div className="col-lg-7 col-xl-8">
                      <div className="py-4 px-2 px-md-3">
                        <div className="row">
                          <div className="col-lg-6 mb-4">
                            <h6 className="font-weight-bold text-uppercase">Soluciones</h6>
                            <ul className="list-unstyled">
                              <li><Dropdown.Item className="dropdown-item" href={`${baseUrl}/crear-tienda-online`}>Crear tienda online</Dropdown.Item></li>
                              <li><Dropdown.Item className="dropdown-item" href={`${baseUrl}/land-crear-tienda-online-de-ropa.html`}>Crear tienda online de ropa</Dropdown.Item></li>
                              <li><Dropdown.Item className="dropdown-item" href={`${baseUrl}/land-crear-farmacia-online.html`}>Crear farmacia online</Dropdown.Item></li>
                              <li><Dropdown.Item className="dropdown-item" href={`${baseUrl}/dropshipping`}>Dropshipping</Dropdown.Item></li>
                              <li><Dropdown.Item className="dropdown-item" href={`${baseUrl}/land-tienda-en-facebook.html`}>Vender en Facebook & Instagram</Dropdown.Item></li>
                              <li><Dropdown.Item className="dropdown-item" href={`${baseUrl}/land-gestion-de-reservas.html`}>Gestión de reservas</Dropdown.Item></li>
                            </ul>
                          </div>
                          <div className="col-lg-6 mb-4">
                            <h6 className="font-weight-bold text-uppercase">Plataforma</h6>
                            <ul className="list-unstyled">
                              <li><Dropdown.Item className="dropdown-item" href={`${baseUrl}/htmlEditor`}>Editor Html drag&drop</Dropdown.Item></li>
                              <li><Dropdown.Item className="dropdown-item" href={`${baseUrl}/mobileApp`}>App móvil para gestión de tienda</Dropdown.Item></li>
                              <li><Dropdown.Item className="dropdown-item" href={`${baseUrl}/palbinExpress`}>Palbin Express</Dropdown.Item></li>
                              <li><Dropdown.Item className="dropdown-item" href={`${baseUrl}/b2b`}>Tienda B2B</Dropdown.Item></li>
                              <li><Dropdown.Item className="dropdown-item" href={`${baseUrl}/features`}>Historial de funcionalidades</Dropdown.Item></li>
                            </ul>
                          </div>
                          <div className="col-lg-6 mb-4">
                            <h6 className="font-weight-bold text-uppercase">Recursos</h6>
                            <ul className="list-unstyled">
                              <li><Dropdown.Item className="dropdown-item" href={`${baseUrl}/land-kit-digital.html`}>Kit Digital</Dropdown.Item></li>
                              <li><Dropdown.Item className="dropdown-item" href={`${baseUrl}/land-kit-consulting.html`}>Kit Consulting</Dropdown.Item></li>
                              <li><Dropdown.Item className="dropdown-item" href={`${baseUrl}/seoguide`}>Guía posicionamiento SEO</Dropdown.Item></li>
                              <li><Dropdown.Item className="dropdown-item" href={`${baseUrl}/ecommerceguide`}>Guía E-commerce</Dropdown.Item></li>
                              <li><Dropdown.Item className="dropdown-item" href={`${baseUrl}/salesCalculator`}>Calculadora de Ventas</Dropdown.Item></li>
                              <li><Dropdown.Item className="dropdown-item" href={`${baseUrl}/tools`}>Herramientas</Dropdown.Item></li>
                            </ul>
                          </div>
                          <div className="col-lg-6 mb-4">
                            <h6 className="font-weight-bold text-uppercase">Sobre Palbin</h6>
                            <ul className="list-unstyled">
                              <li><Dropdown.Item className="dropdown-item" href={`${baseUrl}/aboutUs`}>¿Quiénes somos?</Dropdown.Item></li>
                              <li><Dropdown.Item className="dropdown-item" href={`${baseUrl}/prensa`}>Palbin en los medios</Dropdown.Item></li>
                              <li><Dropdown.Item className="dropdown-item" href={`${baseUrl}/customerInterviews`}>Opiniones y entrevistas a clientes</Dropdown.Item></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-5 col-xl-4 px-5 py-3 d-none d-lg-block">
                      <div 
                        className="more-megamenu-image h-100" 
                        style={{ 
                          background: `center center url('${megamenuImage}') no-repeat`,
                          backgroundSize: 'contain'
                        }}
                      />
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>

              <Nav.Link href={`${baseUrl}/contacto`} className="text-uppercase">
                <i className="bi bi-envelope"></i>
                <span className="d-lg-none"> Contacto</span>
              </Nav.Link>
              <Nav.Link href="https://help.palbin.com" className="text-uppercase">
                <i className="bi bi-question-circle"></i>
                <span className="d-lg-none"> Ayuda</span>
              </Nav.Link>
            </Nav>

            <Nav>
              <li className="nav-item ms-lg-3" title="30 días gratis" data-placement="bottom" data-trigger="hover" data-toggle="tooltip">
                <Button 
                  type="submit"
                  id="w2"
                  className="navbar-btn-cta cta-for-desktop btn-cta d-none d-lg-inline-block btn-sm text-uppercase px-3 my-2 my-md-1 btn btn-primary"
                  href="https://www.palbin.com/es/crear-tienda-online"
                >
                  Crear tienda
                </Button>
              </li>

              <li className="nav-item">
                <a 
                  href="https://admin.palbin.com"
                  className="navbar-btn-login btn btn-sm text-uppercase my-2 my-md-1 ms-lg-3 btn-outline-dark"
                >
                  <i className="icon-user icon-white"></i> Entrar
                </a>
              </li>

              <li className="navbar-divider d-none d-lg-block"></li>

              <li className="nav-item" data-toggle="tooltip" title="Coste de llamada local">
                <a className="navbar-btn-phone btn btn-sm my-1 my-md-1 px-0 btn-link text-primary" href="tel:901 001 814" title="" rel="nofollow">
                  <span className="call"></span> <span className="number">901 001 814</span>
                </a>
              </li>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </header>
  )
} 