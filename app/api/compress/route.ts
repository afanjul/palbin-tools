import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    const apiKey = formData.get('apiKey') as string
    const originalFilename = formData.get('originalFilename') as string

    if (!file || !apiKey) {
      return NextResponse.json(
        { error: 'File and API key are required' },
        { status: 400 }
      )
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // Compress the image
    const compressResponse = await fetch('https://api.tinify.com/shrink', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`
      },
      body: arrayBuffer
    })

    if (!compressResponse.ok) {
      const error = await compressResponse.json()
      return NextResponse.json(error, { status: compressResponse.status })
    }

    const compressData = await compressResponse.json()
    
    // Return the TinyPNG URL for both preview and future resize operations
    return NextResponse.json({ url: compressData.output.url })
    
  } catch (error) {
    console.error('Compression error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
