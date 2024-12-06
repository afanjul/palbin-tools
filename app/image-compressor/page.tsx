'use client'

import { useState, useCallback } from 'react'
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone'
import CompareImage from 'react-compare-image'
import styles from './styles.module.css'

interface ResizeOptions {
  method: 'scale' | 'fit' | 'cover' | 'thumb'
  width?: number
  height?: number
}

export default function ImageCompressor() {
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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      const reader = new FileReader()
      reader.onload = async () => {
        // Get original dimensions
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
  }, [apiKey])

  const compressImage = async (file: File) => {
    try {
      setIsCompressing(true)
      setOriginalFilename(file.name) // Store the original filename

      // Create FormData
      const formData = new FormData()
      formData.append('image', file)
      formData.append('apiKey', apiKey)
      formData.append('originalFilename', file.name)
      
      // Send to our API route for initial compression
      const response = await fetch('/api/compress', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || `HTTP error! status: ${response.status}`)
      }

      const { url } = await response.json()
      setCompressedImageUrl(url) // Store the TinyPNG URL for later use
      setCompressedImage(url) // Use the URL directly for preview
      
    } catch (error) {
      console.error('Compression error:', error)
      alert(error instanceof Error ? error.message : 'Error compressing image. Please check your API key or try again.')
    } finally {
      setIsCompressing(false)
    }
  }

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
      const response = await fetch('/api/resize', {
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
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Image Compressor</h1>
          <p className="text-center text-muted">
            Optimize your images using TinyPNG compression
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Form.Group>
            <Form.Label className="d-flex justify-content-between align-items-center">
              <span>API Key</span>
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
              className={`text-center p-5`}
              style={{ cursor: 'pointer' }}
            >
              <input {...getInputProps()} />
              <Card.Body>
                <i className="bi bi-cloud-upload display-1 mb-3"></i>
                <p>
                  Drag 'n' drop an image here, or click to select
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
  )
}
