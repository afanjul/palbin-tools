import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const apiKey = formData.get('apiKey') as string
    const url = formData.get('url') as string
    const resizeOptionsStr = formData.get('resize') as string
    const originalFilename = formData.get('originalFilename') as string

    if (!url || !apiKey || !resizeOptionsStr) {
      return NextResponse.json(
        { error: 'URL, API key, and resize options are required' },
        { status: 400 }
      )
    }

    // Create output filename
    const extension = originalFilename.substring(originalFilename.lastIndexOf('.'))
    const nameWithoutExt = originalFilename.substring(0, originalFilename.lastIndexOf('.'))
    const outputFilename = `${nameWithoutExt}-compressed${extension}`

    // Parse resize options
    const resizeOptions = JSON.parse(resizeOptionsStr)

    // Apply resize options to the compressed image
    // This will directly return the resized image
    const resizeResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resize: resizeOptions })
    })

    if (!resizeResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to resize image' },
        { status: resizeResponse.status }
      )
    }

    // Get the resized image as a blob
    const blob = await resizeResponse.blob()
    
    // Return the resized image with appropriate headers
    return new NextResponse(blob, {
      headers: {
        'Content-Type': blob.type,
        'Content-Length': blob.size.toString(),
        'Content-Disposition': `attachment; filename="${outputFilename}"`
      }
    })
    
  } catch (error) {
    console.error('Resize error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
