'use client'

import { useState, useCallback } from 'react'
import { Container, Row, Col, Form, Button, Card, ButtonGroup } from 'react-bootstrap'
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
      <div className="tool-description bg-light py-5 mt-5">
        <Container>
          <p>
            Genera contenido para tus redes sociales de forma sencilla y guárdanos en favoritos para utilizar asiduamente la herramienta.
          </p>
          
          <h2 className="h4 mt-4">Cómo cortar imágenes en un carrusel para Instagram</h2>
          <p>
            En primer lugar, arrastra o <strong>selecciona la imagen que necesitas</strong> cortar. Ten en cuenta que la imagen debe estar en formato .png, .jpg, .jpeg o .gif.
          </p>
          <p>
            Posteriormente, podrás <strong>seleccionar entre <em>Grid</em></strong> (cuadrícula, se generan imágenes con la misma altura que anchura, en formato cuadrado, con columnas y filas) <strong>o <em>Carrousel</em></strong> (carrusel, se corta la imagen en varias columnas). También podrás seleccionar el <strong>número de columnas</strong> que necesitas, hasta un máximo de 6.
          </p>
          <p>
            Una vez escogidas tus preferencias, tan sólo tienes que clicar el botón &ldquo;Descargar Zip&rdquo; y descargar el archivo comprimido (que podrás abrir con programas tipo WinRar o 7Zip). Las imágenes se generan con el mismo formato de la imagen original, manteniendo siempre la mayor calidad posible.
          </p>

          <h2 className="h4 mt-4">¿Qué tamaño de fotos necesito usar en Instagram?</h2>
          <p>
            Para <strong>publicar imágenes en Instagram</strong> y que el contenido se muestre correctamente, debes de seguir las siguientes reglas de tamaño:
          </p>
          <ul>
            <li>Fotos cuadradas: 1080 x 1080 px.</li>
            <li>Fotos verticales: 1080 x 1350 px.</li>
            <li>Fotos horizontales: 1080 x 566 px.</li>
            <li>Stories: 750 x 1334 px.</li>
          </ul>
        </Container>
      </div>  
    </div>  
  )
}
