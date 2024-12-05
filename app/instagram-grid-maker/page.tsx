'use client'

import { useState, useCallback } from 'react'
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
    <div className="row justify-content-center">
      <div className="col-12 col-md-10 col-lg-8">
        <div className="card shadow">
          <div className="card-header bg-dark text-white">
            <h4 className="mb-0">Create Your Instagram Grid</h4>
          </div>
          <div className="card-body">
            <div className="mb-4">
              <ImageUploader onImageUpload={handleImageUpload} />
            </div>

            {image && (
              <>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">Grid Mode</h5>
                        <div className="btn-group w-100" role="group">
                          <button 
                            type="button" 
                            className={`btn ${gridMode === 'grid' ? 'btn-danger' : 'btn-outline-danger'}`}
                            onClick={() => handleGridModeChange('grid')}
                          >
                            <i className="bi bi-grid-3x3"></i> Grid
                          </button>
                          <button 
                            type="button" 
                            className={`btn ${gridMode === 'carousel' ? 'btn-danger' : 'btn-outline-danger'}`}
                            onClick={() => handleGridModeChange('carousel')}
                          >
                            <i className="bi bi-images"></i> Carousel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">Columns</h5>
                        <input 
                          type="range" 
                          className="form-range" 
                          min="1" 
                          max="4" 
                          value={columns}
                          onChange={(e) => handleColumnsChange(Number(e.target.value))}
                        />
                        <div className="text-center mt-2">
                          <span className="badge bg-danger">{columns} Columns</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card mb-4">
                  <div className="card-body">
                    <GridPreview 
                      image={image} 
                      columns={columns}
                      gridMode={gridMode}
                      onColumnsChange={handleColumnsChange}
                      onGridModeChange={handleGridModeChange}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <DownloadButton 
                    image={image} 
                    columns={columns} 
                    gridMode={gridMode} 
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
