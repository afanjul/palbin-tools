'use client'

import { useState } from 'react'
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'

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
      <div className="tool-description bg-light py-5 mt-5">
        <Container>
          <p>
            Además, esta herramienta está <strong>potenciada por IA, y optimiza tu mensaje</strong> para captar la atención de los usuarios en redes sociales.
          </p>
          
          <h2 className="h4 mt-4">Cómo hacer hilos para Twitter y otras redes sociales</h2>
          <p>
            Crear threads es muy sencillo con la herramienta de Palbin. Tan solo <strong>pega el texto y clica el botón para obtener tu hilo</strong>. Copia el contenido obtenido y publícalo en la red social que desees. No necesitas nada más, tan sencillo como eso.
          </p>

          <h2 className="h4 mt-4">Cómo puedo crecer en Twitter</h2>
          <p>
            Los mejores consejos que podemos darte para conseguir seguidores en Twitter son: <strong>publicar contenido con mucha frecuencia</strong> (5 tweets al día), seguir a 5 cuentas nuevas cada día que encajen con tus intereses, e <strong>interactuar usualmente</strong> con la audiencia.
          </p>
        </Container>
      </div>
    </div>
  )
}
