/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState, useCallback } from 'react'
import { Container, Row, Col, Form, Button, Card, ButtonGroup, Accordion } from 'react-bootstrap'
import ImageUploader from '../components/ImageUploader'
import GridPreview from '../components/GridPreview'
import DownloadButton from '../components/DownloadButton'

type GridMode = 'carousel' | 'grid';

export default function InstagramGridMaker() {
  const [image, setImage] = useState<string | null>(null)
  const [columns, setColumns] = useState(3)
  const [gridMode, setGridMode] = useState<GridMode>('grid')

  const handleImageUpload = useCallback((newImage: string) => {
    setImage(newImage)
  }, [])

  const handleColumnsChange = useCallback((newColumns: number) => {
    setColumns(newColumns)
  }, [])

  const handleGridModeChange = useCallback((newMode: GridMode) => {
    setGridMode(newMode)
  }, [])

  return (
    <div className="wrapper">
      <div className="tool-ui">
        <Container>
          <h1 className="text-center mb-4">Crear carrusel para Instagram</h1>
          <p className="lead">
            Si necesitas recortar tus imágenes en <strong>formato carrusel o cuadrícula</strong>, puedes utilizar nuestra herramienta gratuita sin necesidad de descargar ningún programa.
          </p>
          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              <Card className="shadow">
                <Card.Header className="bg-dark text-white">
                  <h4 className="mb-0">Create Your Instagram Grid</h4>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-4">
                    <Col>
                      <ImageUploader onImageUpload={handleImageUpload} />
                    </Col>
                  </Row>
                  {image && (
                    <>
                      <Row className="mb-4">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Grid Mode</Form.Label>
                            <ButtonGroup className="w-100">
                              <Button
                                variant={gridMode === 'grid' ? 'danger' : 'light'}
                                onClick={() => handleGridModeChange('grid')}
                              >
                                <i className="bi bi-grid-3x3 me-2"></i>
                                Grid
                              </Button>
                              <Button
                                variant={gridMode === 'carousel' ? 'danger' : 'light'}
                                onClick={() => handleGridModeChange('carousel')}
                              >
                                <i className="bi bi-images me-2"></i>
                                Carousel
                              </Button>
                            </ButtonGroup>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Columns: {columns}</Form.Label>
                            <Form.Range
                              min={1}
                              max={6}
                              step={1}
                              value={columns}
                              onChange={(e) => handleColumnsChange(Number(e.target.value))}
                            />
                            <div className="d-flex justify-content-between text-muted small">
                              <span>1</span>
                              <span>2</span>
                              <span>3</span>
                              <span>4</span>
                              <span>5</span>
                              <span>6</span>
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col>
                          <GridPreview
                            image={image}
                            columns={columns}
                            gridMode={gridMode}
                            onColumnsChange={handleColumnsChange}
                            onGridModeChange={handleGridModeChange}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div className="d-grid">
                            <DownloadButton
                              image={image}
                              columns={columns}
                              gridMode={gridMode}
                            />
                          </div>
                        </Col>
                      </Row>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Sección de reviews - separador */}
      <div className="reviews-section mt-7 py-5 bg-light border-top border-bottom">
        <Container className="text-center">
          <h2 className="mb-4">¡Crea contenido impactante para Instagram!</h2>
          
          <div className="stars-container mb-2">
            <i className="bi bi-star-fill fs-3 text-warning mx-1"></i>
            <i className="bi bi-star-fill fs-3 text-warning mx-1"></i>
            <i className="bi bi-star-fill fs-3 text-warning mx-1"></i>
            <i className="bi bi-star-fill fs-3 text-warning mx-1"></i>
            <i className="bi bi-star-half fs-3 text-warning mx-1"></i>
          </div>
          
          <p className="text-muted">4.57 / 5 promedio de 315 valoraciones</p>
        </Container>
      </div>
      
      <div className="tool-description py-5 mt-5">
        <Container>
          
          {/* Sección de características */}
          <h3 className="h4 mb-4 text-center">Características principales del creador de carruseles para Instagram</h3>
          
          <Row className="row-cols-1 row-cols-md-3 g-4 mb-5">
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-grid-3x3 fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Modo Cuadrícula</h5>
                  <p className="card-text">Divide tu imagen en una cuadrícula perfecta para publicaciones en mosaico que crean un feed atractivo.</p>
                </div>
              </div>
            </Col>
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-images fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Modo Carrusel</h5>
                  <p className="card-text">Corta tu imagen en secciones horizontales para crear publicaciones deslizables que cautivan a los seguidores.</p>
                </div>
              </div>
            </Col>
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-columns-gap fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Columnas Personalizables</h5>
                  <p className="card-text">Elige entre 1 y 6 columnas para adaptar tu contenido según tus necesidades creativas.</p>
                </div>
              </div>
            </Col>
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-eye fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Vista Previa en Tiempo Real</h5>
                  <p className="card-text">Visualiza exactamente cómo se verá tu publicación antes de descargarla para asegurar resultados perfectos.</p>
                </div>
              </div>
            </Col>
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-file-earmark-zip fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Descarga en ZIP</h5>
                  <p className="card-text">Obtén todas tus imágenes perfectamente cortadas en un solo archivo comprimido, listas para su uso.</p>
                </div>
              </div>
            </Col>
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-aspect-ratio fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Conservación de Calidad</h5>
                  <p className="card-text">Mantiene la resolución original de tu imagen para garantizar publicaciones nítidas y profesionales.</p>
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
                ¿Qué diferencia hay entre el modo cuadrícula y carrusel?
              </Accordion.Header>
              <Accordion.Body>
                El modo cuadrícula divide tu imagen en partes iguales tanto horizontal como verticalmente, creando un mosaico perfecto para publicaciones secuenciales en tu feed. El modo carrusel, por otro lado, divide la imagen solo horizontalmente, creando secciones para deslizar horizontalmente en una sola publicación. La cuadrícula es ideal para crear un efecto visual en tu perfil, mientras que el carrusel es perfecto para contar una historia o mostrar una imagen panorámica.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                ¿Cuántas imágenes puedo incluir en un carrusel de Instagram?
              </Accordion.Header>
              <Accordion.Body>
                Instagram permite incluir hasta 10 imágenes en un solo carrusel. Nuestra herramienta te permite dividir tu imagen en hasta 6 columnas, lo que se adapta perfectamente a esta limitación, dejándote incluso espacio para añadir imágenes adicionales si lo deseas.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>
                ¿Se reduce la calidad de mis imágenes al cortarlas?
              </Accordion.Header>
              <Accordion.Body>
                No, nuestra herramienta mantiene la resolución original de tu imagen al dividirla. La calidad final dependerá de la resolución de la imagen que subas. Para mejores resultados, recomendamos utilizar imágenes de alta resolución (al menos 1080px de ancho para Instagram).
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="3">
              <Accordion.Header>
                ¿Qué formatos de imagen puedo utilizar?
              </Accordion.Header>
              <Accordion.Body>
                Nuestra herramienta admite los formatos de imagen más comunes: JPG, PNG, GIF y JPEG. Las imágenes resultantes mantendrán el mismo formato que la imagen original que hayas subido.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="4">
              <Accordion.Header>
                ¿Cómo puedo lograr el efecto de mosaico en mi perfil de Instagram?
              </Accordion.Header>
              <Accordion.Body>
                Para crear un efecto de mosaico en tu perfil, selecciona el modo cuadrícula, establece el número de columnas (generalmente 3 para un efecto estándar), y descarga las imágenes. Luego, súbelas a Instagram en el orden correcto, de abajo a arriba y de izquierda a derecha. Es importante subir todas las imágenes a la vez para mantener el orden y lograr el efecto visual deseado.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="5">
              <Accordion.Header>
                ¿Puedo ajustar el tamaño de los cortes individualmente?
              </Accordion.Header>
              <Accordion.Body>
                Actualmente, nuestra herramienta divide la imagen en partes iguales según el número de columnas seleccionado. Para ajustes más personalizados o recortes irregulares, recomendamos utilizar un programa de edición de imágenes como Photoshop o GIMP.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="6">
              <Accordion.Header>
                ¿Se guardan mis imágenes en vuestros servidores?
              </Accordion.Header>
              <Accordion.Body>
                No, valoramos tu privacidad. Todo el procesamiento de las imágenes se realiza en tu navegador y no almacenamos tus archivos en nuestros servidores. Una vez que cierras la página, no queda ninguna copia de tus imágenes en nuestro sistema.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="7">
              <Accordion.Header>
                ¿Cuál es el tamaño ideal para las imágenes de Instagram?
              </Accordion.Header>
              <Accordion.Body>
                Para obtener la mejor calidad en Instagram, se recomiendan los siguientes tamaños: fotos cuadradas (1080 x 1080 px), fotos verticales (1080 x 1350 px), fotos horizontales (1080 x 566 px) y Stories (750 x 1334 px). Nuestra herramienta funciona mejor con imágenes que se ajusten a estas proporciones.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="8">
              <Accordion.Header>
                ¿Cómo cortar imágenes en un carrusel para Instagram?
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  En primer lugar, arrastra o <strong>selecciona la imagen que necesitas</strong> cortar. Ten en cuenta que la imagen debe estar en formato .png, .jpg, .jpeg o .gif.
                </p>
                <p>
                  Posteriormente, podrás <strong>seleccionar entre <em>Grid</em></strong> (cuadrícula, se generan imágenes con la misma altura que anchura, en formato cuadrado, con columnas y filas) <strong>o <em>Carrousel</em></strong> (carrusel, se corta la imagen en varias columnas). También podrás seleccionar el <strong>número de columnas</strong> que necesitas, hasta un máximo de 6.
                </p>
                <p>
                  Una vez escogidas tus preferencias, tan sólo tienes que clicar el botón &ldquo;Descargar Zip&rdquo; y descargar el archivo comprimido (que podrás abrir con programas tipo WinRar o 7Zip). Las imágenes se generan con el mismo formato de la imagen original, manteniendo siempre la mayor calidad posible.
                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          
          <div className="text-center mb-5">
            <p>
              Con el creador de carruseles para Instagram de Palbin podrás <strong>transformar tus imágenes en publicaciones atractivas</strong> que destacarán en el feed y aumentarán el engagement de tus seguidores, todo sin necesidad de instalar programas complejos.
            </p>
          </div>
        </Container>
      </div>  
    </div>  
  )
}
