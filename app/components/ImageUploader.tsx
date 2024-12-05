'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface ImageUploaderProps {
  onImageUpload: (image: string) => void
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageUpload(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }, [onImageUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }, 
    multiple: false 
  })

  return (
    <div 
      {...getRootProps()} 
      className={`card bg-light border-1 ${isDragActive ? 'border-primary' : 'border-dashed'}`}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-body text-center py-5">
        <input {...getInputProps()} />
        <i className="bi bi-cloud-upload display-4 mb-3"></i>
        <p className="mb-0">
          {isDragActive ? (
            <>
              <span className="fw-bold text-primary">Drop your image here...</span>
              <br />
              <span className="text-muted">or click to select a file</span>
            </>
          ) : (
            <>
              <span className="fw-bold">Drag and drop an image here</span>
              <br />
              <span className="text-muted">or click to select a file</span>
            </>
          )}
        </p>
        <small className="text-muted d-block mt-2">
          Supported formats: PNG, JPG, JPEG, GIF
        </small>
      </div>
    </div>
  )
}
