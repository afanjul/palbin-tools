'use client'
import { Row, Col, Card, Container } from 'react-bootstrap'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Palbin.com Media Tools</h1>
      <Row className="g-4 justify-content-center">
        {/* Instagram Grid Maker Card */}
        <Col md={6} lg={5} className="mb-4">
          <Link href="/instagram-grid-maker" className="text-decoration-none">
            <Card className="h-100 shadow-sm hover-shadow">
              <Image 
                src="/tool-images/instagram-grid-maker.png" 
                alt="Instagram Grid Maker"
                width={500}
                height={200}
                className="card-img-top"
                style={{ objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title className="text-dark">Instagram Grid Maker</Card.Title>
                <Card.Text className="text-muted">
                  Create perfect carousel posts and grid layouts for your Instagram profile. 
                  Split any image into multiple slides or grid pieces with just a few clicks.
                </Card.Text>
              </Card.Body>
              <Card.Footer className="bg-transparent border-0 p-3">
                <div className="btn btn-danger w-100">
                  <i className="bi bi-grid-3x3-gap me-2"></i>
                  Create Grid
                </div>
              </Card.Footer>
            </Card>
          </Link>
        </Col>

        {/* Image Compressor Card */}
        <Col md={6} lg={5} className="mb-4">
          <Link href="#" className="text-decoration-none">
            <Card className="h-100 shadow-sm hover-shadow">
              <Image 
                src="/tool-images/image-compressor.png" 
                alt="Image Compressor"
                width={500}
                height={200}
                className="card-img-top"
                style={{ objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title className="text-dark">Image Compressor</Card.Title>
                <Card.Text className="text-muted">
                  Optimize your PNG and JPG images to reduce file size without losing quality. 
                  Perfect for web and social media use.
                </Card.Text>
              </Card.Body>
              <Card.Footer className="bg-transparent border-0 p-3">
                <div className="btn btn-secondary w-100">
                  <i className="bi bi-file-earmark-zip me-2"></i>
                  Coming Soon
                </div>
              </Card.Footer>
            </Card>
          </Link>
        </Col>
      </Row>
    </Container>
  )
}
