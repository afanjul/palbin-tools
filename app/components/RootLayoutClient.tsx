'use client'

import { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <body className="bg-light d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger mb-4">
        <div className="container">
          <a className="navbar-brand" href="/">
            <i className="bi bi-grid-3x3-gap me-2"></i>
            Palbin.com Media Tools
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="https://github.com/afanjul/instagram-grid-maker" target="_blank">
                  <i className="bi bi-github me-1"></i>
                  Palbin.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main className="container py-4">
        {children}
      </main>
      <footer className="footer mt-auto py-3 bg-dark text-light">
        <div className="container text-center">
          <span>Made by Palbin.com with ❤️</span>
        </div>
      </footer>
    </body>
  )
}
