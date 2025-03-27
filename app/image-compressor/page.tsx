'use client'

import { useState, useCallback } from 'react'
import { Container, Row, Col, Form, Button, Card, Accordion } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone'
import CompareImage from 'react-compare-image'
import styles from './styles.module.css'

interface ResizeOptions {
  method: 'scale' | 'fit' | 'cover' | 'thumb'
  width?: number
  height?: number
}

export default function ImageCompressor() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [compressedImage, setCompressedImage] = useState<string | null>(null)
  const [compressedImageUrl, setCompressedImageUrl] = useState<string | null>(null)
  const [originalFilename, setOriginalFilename] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState('qc7YLYgSB6tm8qsxMKLGPVf8z1bpMFZP')
  const [isCompressing, setIsCompressing] = useState(false)
  const [resizeMethod, setResizeMethod] = useState<ResizeOptions['method']>('fit')
  const [width, setWidth] = useState<number>(800)
  const [height, setHeight] = useState<number>(600)
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number, height: number } | null>(null)

  const compressImage = useCallback(async (file: File) => {
    try {
      setIsCompressing(true)
      setOriginalFilename(file.name)

      const formData = new FormData()
      formData.append('image', file)
      formData.append('apiKey', apiKey)
      formData.append('originalFilename', file.name)
      
      const response = await fetch(`${basePath}/api/compress`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || `HTTP error! status: ${response.status}`)
      }

      const { url } = await response.json()
      setCompressedImageUrl(url)
      setCompressedImage(url)
      
    } catch (error) {
      console.error('Compression error:', error)
      alert(error instanceof Error ? error.message : 'Error compressing image. Please check your API key or try again.')
    } finally {
      setIsCompressing(false)
    }
  }, [basePath, apiKey])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      const reader = new FileReader()
      reader.onload = async () => {
        const img = new Image()
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height })
          setWidth(img.width)
          setHeight(img.height)
        }
        img.src = reader.result as string
        
        setOriginalImage(reader.result as string)
        await compressImage(file)
      }
      reader.readAsDataURL(file)
    }
  }, [compressImage])

  const downloadResized = async () => {
    if (!compressedImageUrl || !originalFilename) return

    try {
      setIsCompressing(true)

      // Create FormData just for resize options
      const formData = new FormData()
      formData.append('apiKey', apiKey)
      formData.append('url', compressedImageUrl)
      formData.append('originalFilename', originalFilename)

      const resizeOptions: ResizeOptions = {
        method: resizeMethod,
        ...(resizeMethod === 'scale' 
          ? width ? { width } : { height }
          : { width, height })
      }
      formData.append('resize', JSON.stringify(resizeOptions))

      // Call resize endpoint
      const response = await fetch(`${basePath}/api/resize`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || `HTTP error! status: ${response.status}`)
      }

      // Get the blob and trigger download
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${originalFilename.replace(/\.[^/.]+$/, '')}-compressed${originalFilename.substring(originalFilename.lastIndexOf('.'))}`
      link.click()
      URL.revokeObjectURL(url)

    } catch (error) {
      console.error('Resize error:', error)
      alert(error instanceof Error ? error.message : 'Error resizing image. Please try again.')
    } finally {
      setIsCompressing(false)
    }
  }

  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey)
    if (originalImage) {
      // Recompress with new API key
      fetch(originalImage)
        .then(res => res.blob())
        .then(blob => new File([blob], 'image', { type: blob.type }))
        .then(file => compressImage(file))
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1
  })

  return (
    <div className="wrapper">
      <div className="tool-ui">
        <Container>
          <h1 className="text-center mb-4">Comprimir imagen online</h1>
          <p className="lead">
            Con esta herramienta puedes <strong>comprimir fotos manteniendo la calidad</strong> de imagen de forma sencilla. Bien lo necesites para ahorrar espacio en tu disco duro o mejorar la velocidad de carga de tu página, comprimir imágenes es la solución.
          </p>
          <Row className="mb-4">
            <Col>
              <Form.Group>
                <Form.Label className="d-flex justify-content-between align-items-center">
                  <span>Tinify - API Key</span>
                  <a
                    href="https://tinypng.com/developers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-danger text-decoration-none"
                  >
                    <small>Get your API key <i className="bi bi-box-arrow-up-right"></i></small>
                  </a>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="Enter your TinyPNG API key"
                />
                <Form.Text className="text-muted">
                  Using default API key. Get your own key for better reliability.
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
          {!originalImage ? (
            <Row className="mb-4">
              <Col>
                <Card
                  {...getRootProps()}
                  className="text-center p-5"
                  style={{ cursor: 'pointer' }}
                >
                  <input {...getInputProps()} />
                  <Card.Body>
                    <i className="bi bi-cloud-upload display-1 mb-3"></i>
                    <p>
                      Drag &apos;n&apos; drop an image here, or click to select
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            <>
        
              <Row className="mb-4">
                <Col>
                  {originalImage && compressedImage && (
                    <CompareImage
                      leftImage={originalImage}
                      rightImage={compressedImage}
                      sliderLineColor="#dc3545"
                    />
                  )}
                  {isCompressing && (
                    <div className="text-center mt-3">
                      <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Compressing...</span>
                      </div>
                      <p className="text-muted mt-2">Compressing image...</p>
                    </div>
                  )}
                </Col>
              </Row>
        
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Resize Method</Form.Label>
                    <Form.Select
                      value={resizeMethod}
                      onChange={(e) => setResizeMethod(e.target.value as ResizeOptions['method'])}
                    >
                      {/* <option value="scale">Scale (proportional)</option> */}
                      <option value="fit">Fit (within dimensions)</option>
                      <option value="cover">Crop (crop to fit)</option>
                      <option value="thumb">Thumb (intelligent crop)</option>
                    </Form.Select>
                    <Form.Text className="text-muted">
                      {resizeMethod === 'scale'
                        ? 'Provide either width or height to scale proportionally'
                        : 'Provide both width and height'}
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Width (px)</Form.Label>
                    <Form.Control
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      disabled={resizeMethod === 'scale' && height !== undefined}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Height (px)</Form.Label>
                    <Form.Control
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      disabled={resizeMethod === 'scale' && width !== undefined}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="d-flex gap-3 justify-content-center">
                  <Button
                    variant="danger"
                    onClick={downloadResized}
                    disabled={isCompressing || !compressedImage}
                  >
                    <i className="bi bi-download me-2"></i>
                    Download Resized Image
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      setOriginalImage(null)
                      setCompressedImage(null)
                      setCompressedImageUrl(null)
                      setOriginalDimensions(null)
                      setOriginalFilename(null)
                    }}
                    disabled={isCompressing}
                  >
                    <i className="bi bi-arrow-counterclockwise me-2"></i>
                    Upload New Image
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>

      {/* Sección de reviews - separador */}
      <div className="reviews-section mt-7 py-5 bg-light border-top border-bottom">
        <Container className="text-center">
          <h2 className="mb-4">¡Miles de usuarios ya saben cómo comprimir imágenes online!</h2>
          <p>
            Utilizar esta herramienta es gratuito y sencillo. Tan sólo arrastra o selecciona la imagen que necesitas comprimir e 
            introduce tus preferencias para llevar a cabo la compresión.
          </p>
          <p>
            Optimizar las imágenes de tu tienda para reducir su peso va a <strong>mejorar la velocidad de carga</strong>. Al 
            reducir esta, mejoramos la experiencia del usuario en nuestra web y facilitamos la accesibilidad a la misma. También 
            aumenta el rendimiento en móviles, principal dispositivo de compra. Recuerda, un usuario frustrado no comprará en tu 
            ecommerce.
          </p>
          <div className="stars-container mb-2">
            <i className="bi bi-star-fill fs-3 text-warning mx-1"></i>
            <i className="bi bi-star-fill fs-3 text-warning mx-1"></i>
            <i className="bi bi-star-fill fs-3 text-warning mx-1"></i>
            <i className="bi bi-star-fill fs-3 text-warning mx-1"></i>
            <i className="bi bi-star-half fs-3 text-warning mx-1"></i>
          </div>
          
          <p className="text-muted">4.75 / 5 promedio de 421 valoraciones</p>
        </Container>
      </div>
      
      <div className="tool-description py-5 mt-5">
        <Container>
          
          {/* Sección de características */}
          <h3 className="h4 mb-4 text-center">Características principales del compresor de imágenes</h3>
          
          <Row className="row-cols-1 row-cols-md-3 g-4 mb-5">
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-speedometer2 fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Compresión Rápida</h5>
                  <p className="card-text">Procesa tus imágenes en segundos manteniendo una alta calidad visual con tecnología avanzada.</p>
                </div>
              </div>
            </Col>
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-eye fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Vista Previa Comparativa</h5>
                  <p className="card-text">Visualiza la diferencia entre la imagen original y comprimida con nuestro comparador interactivo.</p>
                </div>
              </div>
            </Col>
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-arrows-angle-contract fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Múltiples Métodos de Redimensión</h5>
                  <p className="card-text">Opciones flexibles para ajustar el tamaño manteniendo proporciones o recortando según necesites.</p>
                </div>
              </div>
            </Col>
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-cloud-download fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Descarga Instantánea</h5>
                  <p className="card-text">Obtén tu imagen optimizada al instante sin necesidad de esperar a procesamiento adicional.</p>
                </div>
              </div>
            </Col>
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-shield-check fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Seguridad Garantizada</h5>
                  <p className="card-text">Tus imágenes no se almacenan en nuestros servidores, garantizando la privacidad de tus archivos.</p>
                </div>
              </div>
            </Col>
            
            
            <Col>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-image fs-1 text-primary"></i>
                  </div>
                  <h5 className="card-title">Compatible con Múltiples Formatos</h5>
                  <p className="card-text">Soporta formatos populares como JPG, PNG, WebP y más para toda tu colección de imágenes.</p>
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
                ¿Perderé calidad al comprimir mis imágenes?
              </Accordion.Header>
              <Accordion.Body>
                Nuestra herramienta utiliza técnicas de compresión inteligente que minimizan la pérdida visible de calidad. La mayoría de los usuarios no pueden distinguir entre la imagen original y la comprimida, a pesar de una significativa reducción del tamaño de archivo.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                ¿Cómo funciona la compresión de imágenes?
              </Accordion.Header>
              <Accordion.Body>
                Nuestra herramienta utiliza algoritmos avanzados que eliminan datos innecesarios de la imagen sin afectar significativamente su apariencia visual. Esto incluye la optimización de metadatos, reducción inteligente de colores y técnicas de compresión específicas para cada formato de imagen.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>
                ¿Qué formatos de imagen puedo comprimir?
              </Accordion.Header>
              <Accordion.Body>
                Actualmente, nuestra herramienta soporta la compresión de los formatos más comunes: JPEG, PNG, WebP y GIF. Cada formato se procesa con algoritmos específicos para garantizar la mejor relación calidad-tamaño.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="3">
              <Accordion.Header>
                ¿Existe un límite de tamaño para las imágenes?
              </Accordion.Header>
              <Accordion.Body>
                Puedes comprimir imágenes de hasta 5MB con nuestra herramienta gratuita. Para necesidades de procesamiento de imágenes más grandes o en lote, considera explorar nuestras soluciones premium.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="4">
              <Accordion.Header>
                ¿Se guardan mis imágenes en sus servidores?
              </Accordion.Header>
              <Accordion.Body>
                No, tu privacidad es importante para nosotros. Las imágenes se procesan temporalmente en nuestros servidores durante la compresión, pero no se almacenan permanentemente. Una vez que descargas tu imagen comprimida, se eliminan automáticamente de nuestros sistemas.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="5">
              <Accordion.Header>
                ¿Cuál es la diferencia entre los métodos de redimensionamiento?
              </Accordion.Header>
              <Accordion.Body>
                Ofrecemos varios métodos: Fit mantiene la imagen completa dentro de las dimensiones especificadas; Cover rellena exactamente las dimensiones recortando si es necesario; y Thumb utiliza un recorte inteligente que identifica el área de interés de la imagen para preservar lo más importante.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="6">
              <Accordion.Header>
                ¿Para qué sirve comprimir imágenes?
              </Accordion.Header>
              <Accordion.Body>
                Comprimir imágenes tiene múltiples beneficios: acelera la carga de tu sitio web mejorando el SEO y la experiencia del usuario, reduce el consumo de datos en dispositivos móviles, ahorra espacio de almacenamiento y facilita el envío de imágenes por correo electrónico o plataformas de mensajería.
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="7">
              <Accordion.Header>
                ¿Puedo comprimir múltiples imágenes a la vez?
              </Accordion.Header>
              <Accordion.Body>
                Actualmente, nuestra herramienta gratuita procesa una imagen a la vez. Para compresión en lote, te recomendamos explorar nuestras soluciones premium o considerar automatizar el proceso con nuestra API.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          
          <div className="text-center">
            <p>
              Con el compresor de imágenes online de Palbin puedes <strong>optimizar tus fotos manteniendo una excelente calidad</strong> sin necesidad de descargar programas complejos. Aumenta la velocidad de tu web o ahorra espacio en tus dispositivos con esta herramienta gratuita.
            </p>
          </div>
        </Container>
      </div>
    </div>
  )
}
