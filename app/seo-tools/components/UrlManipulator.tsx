"use client";
import { useState } from 'react';
import { Form, Button, Card, Row, Col, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { ClipboardCheck } from 'react-bootstrap-icons';
import { manipulateUrls } from '../services/apiService';
import { UrlManipulationOptions, UrlManipulationResult } from '../types';

export default function UrlManipulator() {
  const [urlsInput, setUrlsInput] = useState('');
  const [options, setOptions] = useState<UrlManipulationOptions>({
    removeDuplicates: true,
    sortUrls: false,
    forceHttps: false,
    removeWww: false,
    removeParams: false,
    forceTrailingSlash: false,
    extractComponent: undefined
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<UrlManipulationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleOptionChange = (option: keyof UrlManipulationOptions, value: boolean | string | undefined) => {
    setOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!urlsInput.trim()) {
      setError('Por favor, introduce al menos una URL.');
      return;
    }
    
    try {
      // Procesar las URLs
      const urls = urlsInput.split('\n').filter(url => url.trim());
      
      setIsLoading(true);
      setError(null);
      
      const result = await manipulateUrls(urls, options);
      setResult(result);
      
      if (!result.success) {
        setError('Error al manipular URLs');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    if (result?.urls.length) {
      navigator.clipboard.writeText(result.urls.join('\n'))
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
        <h3>Manipulador de URLs</h3>
        <p className="text-muted">Aplica diversas transformaciones a una lista de URLs: normalizar formato, extraer componentes, eliminar duplicados y más</p>
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
          
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Opciones de manipulación</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Check 
                    type="checkbox"
                    id="remove-duplicates"
                    label="Eliminar duplicados"
                    checked={options.removeDuplicates}
                    onChange={(e) => handleOptionChange('removeDuplicates', e.target.checked)}
                    className="mb-2"
                  />
                  <Form.Check 
                    type="checkbox"
                    id="sort-urls"
                    label="Ordenar URLs alfabéticamente"
                    checked={options.sortUrls}
                    onChange={(e) => handleOptionChange('sortUrls', e.target.checked)}
                    className="mb-2"
                  />
                </Col>
                <Col md={4}>
                  <Form.Check 
                    type="checkbox"
                    id="force-https"
                    label="Forzar HTTPS"
                    checked={options.forceHttps}
                    onChange={(e) => handleOptionChange('forceHttps', e.target.checked)}
                    className="mb-2"
                  />
                  <Form.Check 
                    type="checkbox"
                    id="remove-www"
                    label="Eliminar 'www.'"
                    checked={options.removeWww}
                    onChange={(e) => handleOptionChange('removeWww', e.target.checked)}
                    className="mb-2"
                  />
                </Col>
                <Col md={4}>
                  <Form.Check 
                    type="checkbox"
                    id="remove-params"
                    label="Eliminar parámetros de consulta"
                    checked={options.removeParams}
                    onChange={(e) => handleOptionChange('removeParams', e.target.checked)}
                    className="mb-2"
                  />
                  <Form.Check 
                    type="checkbox"
                    id="force-trailing-slash"
                    label="Forzar barra al final"
                    checked={options.forceTrailingSlash}
                    onChange={(e) => handleOptionChange('forceTrailingSlash', e.target.checked)}
                    className="mb-2"
                  />
                </Col>
              </Row>
              
              <hr className="my-3" />
              
              <Form.Group>
                <Form.Label>Extraer componente específico</Form.Label>
                <Form.Select
                  value={options.extractComponent || ''}
                  onChange={(e) => handleOptionChange('extractComponent', e.target.value || undefined)}
                >
                  <option value="">No extraer (URL completa)</option>
                  <option value="domain">Solo dominio</option>
                  <option value="path">Solo ruta</option>
                  <option value="query">Solo parámetros de consulta</option>
                  <option value="subdirs">Subdirectorios</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  Esta opción anula las otras transformaciones
                </Form.Text>
              </Form.Group>
            </Card.Body>
          </Card>
          
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
                  Procesando URLs...
                </>
              ) : 'Procesar URLs'}
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
              <h4 className="mb-0">URLs procesadas ({result.urls.length})</h4>
              {result.urls.length > 0 && (
                <Button 
                  variant="outline-secondary"
                  onClick={copyToClipboard}
                >
                  <ClipboardCheck className="me-1" /> 
                  {copied ? 'Copiado!' : 'Copiar URLs'}
                </Button>
              )}
            </div>
            
            {result.urls.length > 0 ? (
              <Card>
                <ListGroup variant="flush" style={{ maxHeight: '300px', overflow: 'auto' }}>
                  {result.urls.map((url, index) => (
                    <ListGroup.Item key={index}>
                      {url}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            ) : (
              <Alert variant="info">
                No se generaron URLs después del procesamiento.
              </Alert>
            )}
            
            {result.errors.length > 0 && (
              <div className="mt-4">
                <h5>Errores durante el procesamiento ({result.errors.length})</h5>
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
