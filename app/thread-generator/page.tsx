'use client'

import { useState } from 'react'
import { Container, Row, Col, Form, Button, Card, Accordion } from 'react-bootstrap'

export default function ThreadGenerator() {
  const [content, setContent] = useState('')
  const [thread, setThread] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateThread = async () => {
    if (!content.trim()) return

    setIsGenerating(true)
    setError(null)
    setThread([])

    try {
      const response = await fetch('/api/thread', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate thread')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
        buffer += text
        
        // Try to extract complete tweets from the buffer
        const tweetMatches = buffer.match(/\d+\.\s+[^\n]+/g) || []
        if (tweetMatches.length > 0) {
          setThread(tweetMatches.map(tweet => tweet.trim()))
          // Keep any partial content in the buffer
          const lastIndex = buffer.lastIndexOf(tweetMatches[tweetMatches.length - 1])
          buffer = buffer.slice(lastIndex + tweetMatches[tweetMatches.length - 1].length)
        }
      }

      // Process any remaining content in the buffer
      const finalTweetMatches = buffer.match(/\d+\.\s+[^\n]+/g) || []
      if (finalTweetMatches.length > 0) {
        setThread(prev => [...prev, ...finalTweetMatches.map(tweet => tweet.trim())])
      }
    } catch (err) {
      console.error('Error generating thread:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate thread')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyThread = () => {
    const threadText = thread
      .map((tweet, index) => `${index + 1}. ${tweet}`)
      .join('\n\n')
    navigator.clipboard.writeText(threadText)
  }

  return (
    <div className="wrapper">
      <div className="tool-ui">
        <Container>
          <h1 className="text-center mb-4">Crear hilos para Twitter y RRSS</h1>
          <p className="lead">
            Si quieres crear hilos para Twitter, Threads, Bluesky u otras redes sociales a partir de textos más largos, puedes utilizar el <strong>generador de hilos gratuito</strong> de Palbin. No es necesario que descargues ningún programa.
          </p>
          <Row className="mb-4">
            <Col>
              <Form.Group>
                <Form.Label>Your Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your content here..."
                  disabled={isGenerating}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col className="d-flex justify-content-center">
              <Button
                variant="primary"
                onClick={generateThread}
                disabled={isGenerating || !content.trim()}
              >
                {isGenerating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Generating...
                  </>
                ) : (
                  'Generate Thread'
                )}
              </Button>
            </Col>
          </Row>
          {error && (
            <Row className="mb-4">
              <Col>
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              </Col>
            </Row>
          )}
          {thread.length > 0 && (
            <>
              <Row className="mb-3">
                <Col className="d-flex justify-content-between align-items-center">
                  <h3 className="mb-0">Generated Thread</h3>
                  <Button variant="outline-primary" onClick={copyThread}>
                    Copy All
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  {thread.map((tweet, index) => (
                    <Card key={index} className="mb-3">
                      <Card.Body>
                        <div className="d-flex">
                          <div className="me-3 text-primary fw-bold">
                            {index + 1}.
                          </div>
                          <div>{tweet}</div>
                        </div>
                        <div className="mt-2 text-muted small">
                          {tweet.length}/280 characters
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>

      {/* Sección de reviews - separador */}
      <div className="reviews-section mt-7 py-5 bg-light border-top border-bottom">
        <Container className="text-center">
          <h2 className="mb-4">¡Crea hilos virales con nuestra herramienta!</h2>
          
          <div className="stars-container mb-2">
            <i className="bi bi-star-fill fs-3 text-warning mx-1"></i>
            <i className="bi bi-star-fill fs-3 text-warning mx-1"></i>
            <i className="bi bi-star-fill fs-3 text-warning mx-1"></i>
            <i className="bi bi-star-fill fs-3 text-warning mx-1"></i>
            <i className="bi bi-star-fill fs-3 text-warning mx-1"></i>
          </div>
          
          <p className="text-muted">4.89 / 5 promedio de 356 valoraciones</p>
        </Container>
      </div>
      
      <div className="tool-description py-5 mt-5">
        <Container>
          
          {/* Sección de características */}
          <h3 className="h4 mb-4 text-center">Características principales del generador de hilos</h3>
          
          <Row className="row-cols-1 row-cols-md-3 g-4 mb-5">
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-lightning-charge fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Generación Instantánea</h5>
                  <p className="card-text">Convierte cualquier texto largo en un hilo perfectamente estructurado en cuestión de segundos.</p>
                </div>
              </div>
            </Col>
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-robot fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Potenciado por IA</h5>
                  <p className="card-text">Nuestra inteligencia artificial optimiza el contenido para maximizar el engagement en redes sociales.</p>
                </div>
              </div>
            </Col>
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-rulers fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Longitud Perfecta</h5>
                  <p className="card-text">Cada tweet se ajusta automáticamente para respetar el límite de caracteres sin cortar ideas importantes.</p>
                </div>
              </div>
            </Col>
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-clipboard-check fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Copia con Un Clic</h5>
                  <p className="card-text">Copia todo el hilo o tweets individuales con un solo clic para publicar rápidamente en cualquier plataforma.</p>
                </div>
              </div>
            </Col>
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-kanban fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Vista Previa Clara</h5>
                  <p className="card-text">Visualiza tu hilo completo con numeración y formato antes de publicarlo para garantizar la coherencia.</p>
                </div>
              </div>
            </Col>
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-diagram-3 fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Multiplataforma</h5>
                  <p className="card-text">Crea contenido para Twitter, Threads, Bluesky y otras redes sociales con la misma herramienta.</p>
                </div>
              </div>
            </Col>
          </Row>
          
          {/* Sección de FAQs */}
          <h3 className="mt-5 mb-4 text-center">Preguntas Frecuentes</h3>
          
          <style>
            {`
              .faq-accordion .accordion-item {
                border: none;
                margin-bottom: 8px;
              }
              .faq-accordion .accordion-button {
                font-weight: bold;
                box-shadow: none;
                border-bottom: 1px solid rgba(0,0,0,0.1);
              }
              .faq-accordion .accordion-button:not(.collapsed) {
                color: inherit;
                background-color: transparent;
                box-shadow: none;
              }
              .faq-accordion .accordion-button:focus {
                box-shadow: none;
              }
            `}
          </style>
          
          <Accordion defaultActiveKey="0" className="mb-5 faq-accordion">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                ¿Cómo funciona el generador de hilos?
              </Accordion.Header>
              <Accordion.Body>
                Nuestro generador de hilos utiliza tecnología de procesamiento de lenguaje natural para dividir tu texto largo en fragmentos óptimos para redes sociales. El sistema analiza la estructura del contenido para asegurar que cada tweet tenga sentido por sí mismo mientras mantiene la coherencia narrativa del hilo completo.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                ¿Cuál es la longitud ideal para un hilo en Twitter?
              </Accordion.Header>
              <Accordion.Body>
                Los hilos más efectivos suelen tener entre 5 y 15 tweets. Esta longitud permite desarrollar una idea completa sin sobrecargar a los lectores. Nuestra herramienta optimiza automáticamente la división del contenido para mantener cada tweet dentro del límite de 280 caracteres mientras preserva la coherencia del mensaje.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>
                ¿Puedo editar los tweets generados?
              </Accordion.Header>
              <Accordion.Body>
                Aunque actualmente no ofrecemos edición directa en la plataforma, puedes copiar los tweets generados y modificarlos en tu aplicación de notas favorita o directamente en la red social antes de publicarlos. Estamos trabajando para implementar funciones de edición en futuras actualizaciones.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="3">
              <Accordion.Header>
                ¿La herramienta funciona con otros idiomas?
              </Accordion.Header>
              <Accordion.Body>
                Sí, nuestra herramienta es compatible con múltiples idiomas, incluyendo español, inglés, francés, alemán y portugués. El algoritmo está diseñado para respetar las estructuras gramaticales y semánticas específicas de cada idioma al dividir el contenido.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="4">
              <Accordion.Header>
                ¿Cómo puedo hacer que mis hilos sean más virales?
              </Accordion.Header>
              <Accordion.Body>
                Para maximizar el potencial viral de tus hilos, incluye un primer tweet impactante que genere curiosidad, utiliza datos sorprendentes o historias personales, incluye recursos visuales cuando sea posible, termina con una llamada a la acción clara y publica en momentos de alta actividad de tu audiencia. Nuestra herramienta ayuda a estructurar el contenido de manera óptima, pero el tema y enfoque son igual de importantes.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="5">
              <Accordion.Header>
                ¿Se guardan mis textos en vuestros servidores?
              </Accordion.Header>
              <Accordion.Body>
                No almacenamos permanentemente los textos que introduces en nuestra herramienta. Los datos son procesados temporalmente para generar el hilo y se eliminan automáticamente después. Tu privacidad y la seguridad de tu contenido son prioritarias para nosotros.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="6">
              <Accordion.Header>
                ¿Existe un límite de texto que puedo convertir en hilos?
              </Accordion.Header>
              <Accordion.Body>
                Nuestra herramienta gratuita puede procesar textos de hasta 5000 caracteres. Para necesidades más extensas, considera explorar nuestras opciones premium que permiten procesar textos más largos y acceder a funcionalidades adicionales.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="7">
              <Accordion.Header>
                ¿Cómo programo la publicación de un hilo en Twitter?
              </Accordion.Header>
              <Accordion.Body>
                Después de generar tu hilo con nuestra herramienta, puedes utilizar plataformas de gestión de redes sociales como Buffer, Hootsuite o TweetDeck para programar la publicación de cada tweet en secuencia. Estas herramientas te permiten establecer la fecha y hora exactas para cada tweet del hilo.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="8">
              <Accordion.Header>
                ¿Cómo hacer hilos para Twitter y otras redes sociales?
              </Accordion.Header>
              <Accordion.Body>
                Crear threads es muy sencillo con la herramienta de Palbin. Tan solo <strong>pega el texto y clica el botón para obtener tu hilo</strong>. Copia el contenido obtenido y publícalo en la red social que desees. No necesitas nada más, tan sencillo como eso.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="9">
              <Accordion.Header>
                ¿Cómo puedo crecer en Twitter?
              </Accordion.Header>
              <Accordion.Body>
                Los mejores consejos que podemos darte para conseguir seguidores en Twitter son: <strong>publicar contenido con mucha frecuencia</strong> (5 tweets al día), seguir a 5 cuentas nuevas cada día que encajen con tus intereses, e <strong>interactuar usualmente</strong> con la audiencia.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          
          <div className="text-center">
            <p>
              Con el generador de hilos de Palbin podrás <strong>crear threads optimizados para maximizar el engagement</strong> en tus redes sociales. Convierte cualquier texto largo en un hilo estructurado y profesional en segundos, sin necesidad de instalar aplicaciones adicionales.
            </p>
          </div>
        </Container>
      </div>
    </div>
  )
}
