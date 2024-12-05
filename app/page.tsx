'use client'

export default function Home() {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">Palbin.com Media Tools</h1>
      
      <div className="row g-4 justify-content-center">
        {/* Instagram Grid Maker Card */}
        <div className="col-12 col-md-6 col-lg-5">
          <a href="/instagram-grid-maker" className="text-decoration-none">
            <div className="card h-100 shadow-sm hover-shadow">
              <img 
                src="/tool-images/instagram-grid-maker.png" 
                className="card-img-top" 
                alt="Instagram Grid Maker"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title text-dark">Instagram Grid Maker</h5>
                <p className="card-text text-muted">
                  Create perfect carousel posts and grid layouts for your Instagram profile. 
                  Split any image into multiple slides or grid pieces with just a few clicks.
                </p>
              </div>
              <div className="card-footer bg-transparent border-0 p-3">
                <div className="btn btn-danger w-100">
                  <i className="bi bi-grid-3x3-gap me-2"></i>
                  Create Grid
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* Image Compressor Card */}
        <div className="col-12 col-md-6 col-lg-5">
          <a href="#" className="text-decoration-none">
            <div className="card h-100 shadow-sm hover-shadow">
              <img 
                src="/tool-images/image-compressor.png" 
                className="card-img-top" 
                alt="Image Compressor"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title text-dark">Image Compressor</h5>
                <p className="card-text text-muted">
                  Optimize your PNG and JPG images to reduce file size without losing quality. 
                  Perfect for web and social media use.
                </p>
              </div>
              <div className="card-footer bg-transparent border-0 p-3">
                <div className="btn btn-secondary w-100">
                  <i className="bi bi-file-earmark-zip me-2"></i>
                  Coming Soon
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
