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
    <Container>
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
  )
}
