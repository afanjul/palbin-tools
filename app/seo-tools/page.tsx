"use client";
import { useState } from "react";
import { Container, Row, Col, Nav, Tab } from "react-bootstrap";
import { 
  UrlScraper,
  BlogGenerator,
  ContactExtractor,
  UrlFilter,
  UrlManipulator
} from "./components";

export default function SeoTools() {
  const [key, setKey] = useState("url-scraper");

  return (
    <div className="wrapper">
      <div className="tool-ui">
        <Container fluid className="py-4">
          <Row className="mb-4">
            <Col>
              <h1 className="mb-3">SEO Tools</h1>
              <p className="lead">
                Herramientas avanzadas para SEO y marketing de contenidos.
              </p>
            </Col>
          </Row>

          <Tab.Container id="seo-tools-tabs" activeKey={key} onSelect={(k) => setKey(k || "url-scraper")}>
            <Row>
              <Col>
                <Nav variant="tabs" className="mb-4">
                  <Nav.Item>
                    <Nav.Link eventKey="url-scraper">Extractor de URLs</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="blog-generator">Generador de Artículos</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="contact-extractor">Extractor de Contactos</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="url-filter">Filtro de URLs</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="url-manipulator">Manipulador de URLs</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
            </Row>

            <Row>
              <Col>
                <Tab.Content>
                  <Tab.Pane eventKey="url-scraper">
                    <UrlScraper />
                  </Tab.Pane>
                  <Tab.Pane eventKey="blog-generator">
                    <BlogGenerator />
                  </Tab.Pane>
                  <Tab.Pane eventKey="contact-extractor">
                    <ContactExtractor />
                  </Tab.Pane>
                  <Tab.Pane eventKey="url-filter">
                    <UrlFilter />
                  </Tab.Pane>
                  <Tab.Pane eventKey="url-manipulator">
                    <UrlManipulator />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Container>
      </div>
    </div>
  );
}
