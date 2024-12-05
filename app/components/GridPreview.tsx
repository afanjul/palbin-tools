import React, { useState, useCallback, useRef, useEffect } from 'react'
import styles from './GridPreview.module.css'

type GridMode = 'carousel' | 'grid';

interface GridPreviewProps {
  image: string | null
  columns: number
  gridMode: GridMode
  onColumnsChange: (columns: number) => void
  onGridModeChange: (mode: GridMode) => void
}

export default function GridPreview({ image, columns, gridMode, onColumnsChange, onGridModeChange }: GridPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !image) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      setCanvasSize({ width: img.width, height: img.height })

      ctx.drawImage(img, 0, 0)

      const cellWidth = img.width / columns
      let cellHeight = gridMode === 'grid' ? cellWidth : img.height

      const rows = gridMode === 'grid' ? Math.ceil(img.height / cellHeight) : 1

      ctx.strokeStyle = 'rgba(255, 255, 255, 1)'
      ctx.lineWidth = 3

      for (let i = 1; i < columns; i++) {
        const x = Math.floor(i * cellWidth) - 0.5
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      if (gridMode === 'grid') {
        for (let i = 1; i < rows; i++) {
          const y = Math.floor(i * cellHeight) - 0.5
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }
      }
    }
    img.src = image

  }, [image, columns, gridMode])

  useEffect(() => {
    drawGrid()
  }, [drawGrid])

  return (
    <div className={styles.gridPreview}>
      <div className={styles.canvasContainer}>
        <canvas 
          ref={canvasRef}
          className={styles.canvas}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '80vh',
            objectFit: 'contain'
          }}
        />
      </div>
    </div>
  )
}
