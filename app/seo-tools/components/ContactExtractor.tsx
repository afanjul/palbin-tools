"use client";
import { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Spinner, Alert, Table } from 'react-bootstrap';
import { ClipboardCheck, FileEarmarkArrowDown, ArrowRepeat } from 'react-bootstrap-icons';
import apiService from '../services/apiService';
import { DEFAULT_EXTRACTION_SCHEMA, DEFAULT_EXTRACTION_PROMPT } from '../services/firecrawlService';
import { saveAs } from 'file-saver';

// Tipo para los resultados de extracción
interface ExtractedInfo {
  url: string;
  [key: string]: any;
}

export default function ContactExtractor() {
  const [urlsInput, setUrlsInput] = useState('');
  const [prompt, setPrompt] = useState(DEFAULT_EXTRACTION_PROMPT);
  // Formatear el esquema por defecto con la estructura correcta
  const [schemaInput, setSchemaInput] = useState(JSON.stringify({
    type: "object",
    properties: DEFAULT_EXTRACTION_SCHEMA.shape
  }, null, 2));
  const [enableWebSearch, setEnableWebSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo[]>([]);
  const [schemaError, setSchemaError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Cargar URLs si fueron pasadas desde el Extractor de URLs
  useEffect(() => {
    const savedUrls = localStorage.getItem('contact-extractor-urls');
    if (savedUrls) {
      setUrlsInput(savedUrls);
      localStorage.removeItem('contact-extractor-urls');
    }
    
    // Cargar prompt guardado en localStorage
    const savedPrompt = localStorage.getItem('contact-extractor-prompt');
    if (savedPrompt) {
      setPrompt(savedPrompt);
    }
    
    // Cargar esquema JSON guardado en localStorage
    const savedSchema = localStorage.getItem('contact-extractor-schema');
    if (savedSchema) {
      setSchemaInput(savedSchema);
    }
  }, []);
  
  // Validar el esquema JSON
  useEffect(() => {
    try {
      if (schemaInput.trim()) {
        JSON.parse(schemaInput);
        setSchemaError(null);
      }
    } catch (error) {
      setSchemaError('El esquema JSON no es válido: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  }, [schemaInput]);
  
  // Guardar prompt en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('contact-extractor-prompt', prompt);
  }, [prompt]);
  
  // Guardar esquema en localStorage cuando cambie (solo si es válido)
  useEffect(() => {
    if (!schemaError && schemaInput.trim()) {
      localStorage.setItem('contact-extractor-schema', schemaInput);
    }
  }, [schemaInput, schemaError]);
  
  const resetPrompt = () => {
    setPrompt(DEFAULT_EXTRACTION_PROMPT);
  };
  
  const resetSchema = () => {
    setSchemaInput(JSON.stringify({
      type: "object",
      properties: DEFAULT_EXTRACTION_SCHEMA.shape
    }, null, 2));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!urlsInput.trim()) {
      setError('Por favor, introduce al menos una URL.');
      return;
    }
    
    if (schemaError) {
      setError('Por favor, corrige el esquema JSON antes de continuar.');
      return;
    }
    
    try {
      // Preprocesar las URLs (dividir por líneas)
      const urlLines = urlsInput.split('\n').filter(line => line.trim());
      
      setIsLoading(true);
      setError(null);
      setExtractedInfo([]);
      
      // Parsear el esquema
      let schema: any;
      try {
        schema = JSON.parse(schemaInput);
      } catch (error) {
        throw new Error('Error al parsear el esquema JSON: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      }
      
      // Configurar la extracción
      const input = {
        urls: urlLines,
        schema,
        prompt,
        enableWebSearch
      };
      
      const response = await apiService.extractContactInfo(input);
      
      // Si la respuesta es exitosa, establecemos los resultados
      setExtractedInfo(response.extractedInfo);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    if (!extractedInfo.length) return;
    
    // Convertir a formato CSV
    try {
      // Obtener los campos desde el esquema JSON actual
      let fields = [];
      try {
        const schema = JSON.parse(schemaInput);
        // Comprobar si el esquema tiene la estructura { type: "object", properties: {...} }
        if (schema.properties) {
          fields = Object.keys(schema.properties);
        } else {
          // Si no tiene esa estructura, usar directamente las claves del objeto
          fields = Object.keys(schema);
        }
      } catch (e) {
        // En caso de error, usar el esquema por defecto
        fields = Object.keys(DEFAULT_EXTRACTION_SCHEMA.shape);
      }
      
      // Crear el encabezado
      let csv = ['URL', ...fields].join(',') + '\\n';
      
      // Añadir los datos
      for (const item of extractedInfo) {
        const row = [
          item.url,
          ...fields.map(field => {
            const value = item[field] || '';
            // Escapar las comas en los valores
            return value.toString().includes(',') ? `"${value}"` : value;
          })
        ];
        csv += row.join(',') + '\\n';
      }
      
      navigator.clipboard.writeText(csv)
        .then(() => {
          alert('Datos copiados al portapapeles en formato CSV');
        })
        .catch(err => {
          setError('Error al copiar al portapapeles: ' + err.message);
        });
    } catch (error) {
      setError('Error al generar CSV: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };
  
  const downloadCsv = () => {
    if (!extractedInfo.length) return;
    
    try {
      // Obtener los campos desde el esquema JSON actual
      let fields = [];
      try {
        const schema = JSON.parse(schemaInput);
        // Comprobar si el esquema tiene la estructura { type: "object", properties: {...} }
        if (schema.properties) {
          fields = Object.keys(schema.properties);
        } else {
          // Si no tiene esa estructura, usar directamente las claves del objeto
          fields = Object.keys(schema);
        }
      } catch (e) {
        // En caso de error, usar el esquema por defecto
        fields = Object.keys(DEFAULT_EXTRACTION_SCHEMA.shape);
      }
      
      // Crear el encabezado
      let csv = ['URL', ...fields].join(',') + '\\n';
      
      // Añadir los datos
      for (const item of extractedInfo) {
        const row = [
          item.url,
          ...fields.map(field => {
            const value = item[field] || '';
            // Escapar las comas en los valores
            return value.toString().includes(',') ? `"${value}"` : value;
          })
        ];
        csv += row.join(',') + '\\n';
      }
      
      // Crear y descargar el archivo
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `contactos-extraidos-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      setError('Error al generar y descargar CSV: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };
  
  // Extraer los campos del esquema para las columnas de la tabla
  let tableColumns: string[] = [];
  try {
    if (schemaInput.trim()) {
      const schema = JSON.parse(schemaInput);
      // Comprobar si el esquema tiene la estructura { type: "object", properties: {...} }
      if (schema.properties) {
        tableColumns = Object.keys(schema.properties);
      } else {
        // Si no tiene esa estructura, usar directamente las claves del objeto
        tableColumns = Object.keys(schema);
      }
    }
  } catch (error) {
    // Ya se maneja el error en otro lugar
  }
  
  return (
    <Card>
      <Card.Header>
        <h3>Extractor de Contactos</h3>
        <p className="text-muted">Extrae información de contacto estructurada de múltiples URLs usando IA</p>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          {/* URLs a ancho completo */}
          <Row className="mb-3">
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>URLs (una por línea, o separadas por comas)</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={5}
                  placeholder="https://empresa1.com, https://empresa1.com/contacto&#10;https://empresa2.com, https://empresa2.com/about-us&#10;https://empresa3.com" 
                  value={urlsInput}
                  onChange={(e) => setUrlsInput(e.target.value)}
                  required
                />
                <Form.Text className="text-muted">
                  <strong>Formato:</strong> Una empresa por línea. Para mejores resultados, incluye múltiples URLs de la misma empresa (página principal, contacto, about) separadas por comas.
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
          
          {/* Prompt y Schema en dos columnas */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <div className="d-flex justify-content-between">
                  <Form.Label>Prompt de extracción</Form.Label>
                  <Button variant="link" size="sm" className="p-0" onClick={resetPrompt}>
                    <ArrowRepeat className="me-1" /> Restablecer
                  </Button>
                </div>
                <Form.Control 
                  as="textarea" 
                  rows={6}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <Form.Text className="text-muted">
                  Define qué información quieres extraer en lenguaje natural
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <div className="d-flex justify-content-between">
                  <Form.Label>Esquema JSON para la extracción</Form.Label>
                  <Button variant="link" size="sm" className="p-0" onClick={resetSchema}>
                    <ArrowRepeat className="me-1" /> Restablecer
                  </Button>
                </div>
                <Form.Control 
                  as="textarea" 
                  rows={6}
                  value={schemaInput}
                  onChange={(e) => setSchemaInput(e.target.value)}
                  isInvalid={!!schemaError}
                />
                {schemaError && (
                  <Form.Control.Feedback type="invalid">
                    {schemaError}
                  </Form.Control.Feedback>
                )}
                <Form.Text className="text-muted">
                  Define el esquema de los datos que quieres extraer en formato JSON Schema
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-4">
            <Col>
              <Form.Check 
                type="checkbox"
                id="enable-web-search"
                label="Habilitar búsqueda web para mejorar la extracción (puede ser más lento)"
                checked={enableWebSearch}
                onChange={(e) => setEnableWebSearch(e.target.checked)}
              />
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
                  Extrayendo contactos...
                </>
              ) : 'Extraer Contactos'}
            </Button>
          </div>
        </Form>
        
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}
        
        {extractedInfo.length > 0 && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">Contactos extraídos ({extractedInfo.length})</h4>
              <div>
                <Button 
                  variant="outline-secondary" 
                  className="me-2"
                  onClick={copyToClipboard}
                  disabled={isLoading}
                >
                  <ClipboardCheck className="me-1" /> Copiar como CSV
                </Button>
                <Button 
                  variant="outline-primary"
                  onClick={downloadCsv}
                  disabled={isLoading}
                >
                  <FileEarmarkArrowDown className="me-1" /> Descargar CSV
                </Button>
              </div>
            </div>
            
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>URL</th>
                    {tableColumns.map(column => (
                      <th key={column}>{column.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {extractedInfo.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          {item.url}
                        </a>
                      </td>
                      {tableColumns.map(column => (
                        <td key={column}>{item[column] || ''}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
