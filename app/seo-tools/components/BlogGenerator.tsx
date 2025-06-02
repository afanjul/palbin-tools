"use client";
import { useState } from 'react';
import { Form, Button, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { ClipboardCheck } from 'react-bootstrap-icons';
import apiService from '../services/apiService';
import { GOOGLE_DOMAINS } from '../services/serpApiService';
import { AI_MODELS } from '../services/openRouterService';

export default function BlogGenerator() {
  const [topic, setTopic] = useState('');
  const [numSourceUrls, setNumSourceUrls] = useState(5);
  const [aiModel, setAiModel] = useState('openai/gpt-3.5-turbo');
  const [googleDomain, setGoogleDomain] = useState('google.es');
  const [isLoading, setIsLoading] = useState(false);
  const [blogContent, setBlogContent] = useState<string>('');
  const [sources, setSources] = useState<Array<{url: string; title: string}>>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Por favor, introduce un tema para el artículo.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Primero extraemos las URLs
      const urlsResult = await apiService.extractUrls({
        query: topic,
        numResults: numSourceUrls,
        googleDomain
      });
      
      if (urlsResult.urls.length === 0) {
        throw new Error('No se encontraron URLs para el tema especificado');
      }
      
      // Ahora generamos el contenido del blog
      const result = await apiService.generateBlogContent({
        topic,
        urls: urlsResult.urls,
        aiModel
      });
      
      setBlogContent(result.content);
      setSources(urlsResult.urls.map((url, index) => ({
        url,
        title: `Fuente ${index + 1}`
      })));
      
    } catch (error) {
      console.error("Error al generar el blog:", error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      setBlogContent('');
      setSources([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    if (blogContent) {
      navigator.clipboard.writeText(blogContent)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          setError('Error al copiar al portapapeles: ' + err.message);
        });
    }
  };
  
  // Helper para encontrar el nombre legible del dominio seleccionado
  const getDomainName = (domainCode: string): string => {
    const domain = GOOGLE_DOMAINS.find(d => d.code === domainCode);
    return domain ? domain.name : domainCode;
  };
  
  return (
    <Card>
      <Card.Header>
        <h3>Generador de Artículos</h3>
        <p className="text-muted">Genera artículos de blog basados en los resultados más relevantes de Google y contenido extraído con IA</p>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tema del artículo</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Ej: cómo mejorar el SEO de mi página web" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>Num. URLs fuente</Form.Label>
                <Form.Control 
                  type="number"
                  min={1}
                  max={10}
                  value={numSourceUrls}
                  onChange={(e) => setNumSourceUrls(parseInt(e.target.value))}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>Modelo de IA</Form.Label>
                <Form.Select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                >
                  {AI_MODELS.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
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
                  Generando artículo... (puede tardar unos minutos)
                </>
              ) : 'Generar Artículo'}
            </Button>
          </div>
        </Form>
        
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}
        
        {blogContent && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">Artículo generado sobre: <strong>{topic}</strong></h4>
              <Button 
                variant="outline-secondary"
                onClick={copyToClipboard}
              >
                <ClipboardCheck className="me-1" /> 
                {copied ? 'Copiado!' : 'Copiar Contenido'}
              </Button>
            </div>
            
            <Card className="mb-4">
              <Card.Body>
                <pre 
                  style={{ 
                    whiteSpace: 'pre-wrap', 
                    fontFamily: 'inherit',
                    backgroundColor: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '5px'
                  }}
                >
                  {blogContent}
                </pre>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Header>
                <h5 className="mb-0">Fuentes utilizadas</h5>
              </Card.Header>
              <Card.Body>
                <ol>
                  {sources.map((source, index) => (
                    <li key={index} className="mb-2">
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        {source.title || source.url}
                      </a>
                    </li>
                  ))}
                </ol>
              </Card.Body>
            </Card>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
