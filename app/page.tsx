'use client'

import { useState, useCallback } from 'react'
import ImageUploader from './components/ImageUploader'
import GridPreview from './components/GridPreview'
import DownloadButton from './components/DownloadButton'
import styles from './page.module.css'

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
    <main className={styles.main}>
      <h1 className={styles.title}>Instagram Grid Maker</h1>
      <div className={styles.container}>
        <ImageUploader onImageUpload={handleImageUpload} />
        {image && (
          <>
            <GridPreview 
              image={image} 
              columns={columns}
              gridMode={gridMode}
              onColumnsChange={handleColumnsChange}
              onGridModeChange={handleGridModeChange}
            />
            <DownloadButton image={image} columns={columns} gridMode={gridMode} />
          </>
        )}
      </div>
    </main>
  )
}
