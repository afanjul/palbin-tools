'use client'
import { Row, Col, Card, Container } from 'react-bootstrap'
import Link from 'next/link'
import Image from 'next/image'
import { tools } from './data/tools'


const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function Home() {
  return (
    <Container>
      <h1 className="text-center mb-5">Herramientas para Social Media</h1>
      <Row className="g-4 justify-content-center">
        {tools.map((tool) => (
          <Col key={tool.id} md={6} lg={5} className="mb-4">
            <Link href={tool.link} className="text-decoration-none">
              <Card className="h-100 shadow-sm hover-shadow">
                <Image 
                  src={basePath+tool.image}
                  alt={tool.title}
                  width={500}
                  height={200}
                  className="card-img-top"
                  style={{ objectFit: 'cover', backgroundColor: '#f7f9f6' }}
                />
                <Card.Body>
                  <Card.Title className="text-dark">{tool.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {tool.description}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="bg-transparent border-0 p-3">
                  <div className={`btn btn-${tool.buttonVariant} w-100`}>
                    <i className={`bi ${tool.buttonIcon} me-2`}></i>
                    {tool.buttonText}
                  </div>
                </Card.Footer>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  )
}
