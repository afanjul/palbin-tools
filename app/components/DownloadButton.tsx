import { useCallback } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import styles from './DownloadButton.module.css'

type GridMode = 'carousel' | 'grid';

interface DownloadButtonProps {
  columns: number
  image: string | null
  gridMode: GridMode
}

export default function DownloadButton({ image, columns, gridMode }: DownloadButtonProps) {
  const createSubImage = useCallback((img: HTMLImageElement, row: number, col: number): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Could not get canvas context')
      }

      const cellWidth = img.width / columns
      let cellHeight = gridMode === 'grid' ? cellWidth : img.height

      canvas.width = cellWidth
      canvas.height = cellHeight

      ctx.drawImage(
        img,
        col * cellWidth,
        row * cellHeight,
        cellWidth,
        cellHeight,
        0,
        0,
        cellWidth,
        cellHeight
      )

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          throw new Error('Could not create blob from canvas')
        }
      }, 'image/jpeg', 0.95)
    })
  }, [columns, gridMode])

  const handleDownload = useCallback(async () => {
    if (!image) return

    const zip = new JSZip()

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = async () => {
      const rows = gridMode === 'grid' ? Math.ceil(img.height / (img.width / columns)) : 1

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const blob = await createSubImage(img, row, col)
          zip.file(`image_${row + 1}_${col + 1}.jpg`, blob)
        }
      }

      const gridInfo = `Grid Mode: ${gridMode}, Columns: ${columns}`
      zip.file('grid_info.txt', gridInfo)

      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, 'instagram_grid.zip')
    }
    img.src = image

  }, [image, columns, gridMode, createSubImage])

  return (
    <button 
      onClick={handleDownload}
      className="btn btn-primary btn-lg"
      disabled={!image}
    >
      <i className="bi bi-download me-2"></i>
      Descargar Grid
    </button>
  )
}
