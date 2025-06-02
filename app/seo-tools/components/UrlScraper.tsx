"use client";
import { useState } from 'react';
import { Form, Button, Card, Row, Col, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { ClipboardCheck, ArrowRight } from 'react-bootstrap-icons';
import apiService from '../services/apiService';
import { GOOGLE_DOMAINS } from '../services/serpApiService';

export default function UrlScraper() {
  const [query, setQuery] = useState('');
  const [numResults, setNumResults] = useState(10);
  const [googleDomain, setGoogleDomain] = useState('google.es');
  const [isLoading, setIsLoading] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Por favor, introduce una consulta de búsqueda.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Usar el nuevo método del apiService
      const result = await apiService.extractUrls({
        query,
        numResults,
        googleDomain
      });
      
      setUrls(result.urls);
    } catch (error) {
      console.error("Error en la extracción de URLs:", error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      setUrls([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    if (urls.length) {
      navigator.clipboard.writeText(urls.join('\n'))
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          setError('Error al copiar al portapapeles: ' + err.message);
        });
    }
  };
  
  const sendToContactExtractor = () => {
    if (urls.length) {
      // En una implementación real, esto podría usar un estado global o localStorage
      localStorage.setItem('contact-extractor-urls', urls.join('\n'));
      // Cambiar a la pestaña de extractor de contactos
      const contactTab = document.querySelector('a[href="#contact-extractor"]');
      if (contactTab instanceof HTMLElement) {
        contactTab.click();
      }
    }
  };
  
  return (
    <Card>
      <Card.Header>
        <h3>Extractor de URLs de Google</h3>
        <p className="text-muted">Extrae URLs de los resultados orgánicos de Google para cualquier consulta</p>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Consulta de búsqueda</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Ej: marketing digital para pymes" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Número de resultados</Form.Label>
                <Form.Control 
                  type="number"
                  min={1}
                  max={100}
                  value={numResults}
                  onChange={(e) => setNumResults(parseInt(e.target.value))}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Dominio de Google</Form.Label>
                <Form.Select
                  value={googleDomain}
                  onChange={(e) => setGoogleDomain(e.target.value)}
                >
                  {GOOGLE_DOMAINS.map(domain => (
                    <option key={domain.code} value={domain.code}>
                      {domain.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <div className="d-grid gap-2 mb-4">
            <Button 
              variant="primary" 
              type="submit" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Extrayendo URLs...
                </>
              ) : 'Extraer URLs'}
            </Button>
          </div>
        </Form>
        
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}
        
        {urls.length > 0 && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">Resultados de la consulta: <strong>{query}</strong></h4>
              <div>
                <Button 
                  variant="outline-secondary" 
                  className="me-2"
                  onClick={copyToClipboard}
                >
                  <ClipboardCheck className="me-1" /> 
                  {copied ? 'Copiado!' : 'Copiar URLs'}
                </Button>
                <Button 
                  variant="outline-primary"
                  onClick={sendToContactExtractor}
                >
                  Enviar a Extractor de Contactos <ArrowRight className="ms-1" />
                </Button>
              </div>
            </div>
            
            <Card>
              <Card.Header>
                <div className="d-flex justify-content-between">
                  <span>Dominio: <strong>{googleDomain}</strong></span>
                  <span>Total URLs: <strong>{urls.length}</strong></span>
                </div>
              </Card.Header>
              <ListGroup variant="flush" style={{ maxHeight: '400px', overflow: 'auto' }}>
                {urls.map((url, index) => (
                  <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                    <span className="text-truncate" style={{ maxWidth: '80%' }}>{url}</span>
                    <small className="text-muted">#{index + 1}</small>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
