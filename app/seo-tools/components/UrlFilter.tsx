"use client";
import { useState } from 'react';
import { Form, Button, Card, Row, Col, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { ClipboardCheck } from 'react-bootstrap-icons';
import { filterUrls } from '../services/apiService';
import { UrlFilterResult } from '../types';

export default function UrlFilter() {
  const [urlsInput, setUrlsInput] = useState('');
  const [includeKeywords, setIncludeKeywords] = useState('');
  const [excludeKeywords, setExcludeKeywords] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<UrlFilterResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!urlsInput.trim()) {
      setError('Por favor, introduce al menos una URL.');
      return;
    }
    
    // Verificar que haya al menos un criterio de filtrado
    if (!includeKeywords.trim() && !excludeKeywords.trim()) {
      setError('Por favor, introduce al menos una palabra clave para incluir o excluir.');
      return;
    }
    
    try {
      // Procesar las URLs y keywords
      const urls = urlsInput.split('\n').filter(url => url.trim());
      const includeKws = includeKeywords.split('\n').filter(kw => kw.trim());
      const excludeKws = excludeKeywords.split('\n').filter(kw => kw.trim());
      
      setIsLoading(true);
      setError(null);
      
      const result = await filterUrls(urls, includeKws, excludeKws);
      setResult(result);
      
      if (!result.success) {
        setError('Error al filtrar URLs');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    if (result?.filtered_urls.length) {
      navigator.clipboard.writeText(result.filtered_urls.join('\n'))
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          setError('Error al copiar al portapapeles: ' + err.message);
        });
    }
  };
  
  return (
    <Card>
      <Card.Header>
        <h3>Filtro de URLs por Contenido</h3>
        <p className="text-muted">Filtra URLs basándote en la presencia o ausencia de palabras clave en su contenido HTML</p>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>URLs (una por línea)</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={5}
                  placeholder="https://ejemplo1.com&#10;https://ejemplo2.com&#10;https://ejemplo3.com" 
                  value={urlsInput}
                  onChange={(e) => setUrlsInput(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Palabras clave a INCLUIR (una por línea)</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  placeholder="marketing&#10;SEO&#10;estrategia" 
                  value={includeKeywords}
                  onChange={(e) => setIncludeKeywords(e.target.value)}
                />
                <Form.Text className="text-muted">
                  Solo se mostrarán URLs que contengan TODAS estas palabras clave
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Palabras clave a EXCLUIR (una por línea)</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  placeholder="WordPress&#10;Wix&#10;contacto" 
                  value={excludeKeywords}
                  onChange={(e) => setExcludeKeywords(e.target.value)}
                />
                <Form.Text className="text-muted">
                  Se excluirán URLs que contengan CUALQUIERA de estas palabras clave
                </Form.Text>
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
                  Filtrando URLs...
                </>
              ) : 'Filtrar URLs'}
            </Button>
          </div>
        </Form>
        
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}
        
        {result && result.success && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">URLs filtradas ({result.filtered_urls.length})</h4>
              {result.filtered_urls.length > 0 && (
                <Button 
                  variant="outline-secondary"
                  onClick={copyToClipboard}
                >
                  <ClipboardCheck className="me-1" /> 
                  {copied ? 'Copiado!' : 'Copiar URLs'}
                </Button>
              )}
            </div>
            
            {result.filtered_urls.length > 0 ? (
              <Card>
                <ListGroup variant="flush" style={{ maxHeight: '300px', overflow: 'auto' }}>
                  {result.filtered_urls.map((url, index) => (
                    <ListGroup.Item key={index}>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {url}
                      </a>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            ) : (
              <Alert variant="info">
                Ninguna URL cumple con los criterios de filtrado.
              </Alert>
            )}
            
            {result.errors.length > 0 && (
              <div className="mt-4">
                <h5>URLs con errores ({result.errors.length})</h5>
                <ListGroup variant="flush" style={{ maxHeight: '200px', overflow: 'auto' }}>
                  {result.errors.map((error, index) => (
                    <ListGroup.Item key={index} className="text-danger">
                      {error}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
