import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST (req) {
  try {
    const filePath = path.resolve('public/hupp.json')
    const fileData = await fs.readFile(filePath, 'utf-8')
    const jsonData = JSON.parse(fileData)

    const keys = await req.json()

    if (Array.isArray(keys) && keys.length > 0) {
      const result = {}
      for (const key of keys) {
        if (!(key in jsonData.brand)) {
          return NextResponse.json(
            { error: `Key ${key} not found` },
            { status: 404 }
          )
        }
        result[key] = jsonData.brand[key]
      }
      return NextResponse.json(result)
    } else {
      return NextResponse.json(jsonData.brand)
    }
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
