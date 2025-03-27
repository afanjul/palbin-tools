'use client'

import React from 'react'
import { Container, Button } from 'react-bootstrap'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to an error reporting service
    console.error('Error caught by boundary:', error)
    console.error('Component stack:', errorInfo.componentStack)
    
    this.setState({
      error,
      errorInfo
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5">
          <div className="text-center">
            <h2 className="mb-4">¡Ups! Algo salió mal</h2>
            <p className="text-muted mb-4">
              Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
            </p>
            <Button 
              variant="primary" 
              onClick={this.handleReset}
              className="me-2"
            >
              Intentar de nuevo
            </Button>
            <Button 
              variant="outline-primary" 
              onClick={() => window.location.reload()}
            >
              Recargar página
            </Button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-4 text-start">
                <h5 className="text-danger">Detalles del error:</h5>
                <pre className="bg-light p-3 rounded">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <pre className="bg-light p-3 rounded mt-2">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </Container>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary 