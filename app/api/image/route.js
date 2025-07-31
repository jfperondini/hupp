import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST (req) {
  try {
    const filePath = path.resolve('public/hupp.json')
    const fileData = await fs.readFile(filePath, 'utf-8')
    const jsonData = JSON.parse(fileData)
    const { id } = await req.json()
    if (!Array.isArray(id) || id.some(id => typeof id !== 'number')) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }
    const filteredImages = jsonData.image.filter(image => id.includes(image.id))
    return NextResponse.json(filteredImages)
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET () {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
}
