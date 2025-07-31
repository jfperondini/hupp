import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST (req) {
  try {
    const filePath = path.resolve('public/hupp.json')
    const fileData = await fs.readFile(filePath, 'utf-8')
    const jsonData = JSON.parse(fileData)

    const { id, fileds } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: 'city id is required' },
        { status: 400 }
      )
    }

    const city = jsonData.city.find(c => c.id === parseInt(id))
    if (!city) {
      return NextResponse.json({ error: 'city not found' }, { status: 404 })
    }

    const neighborhoods = city.neighborhood

    if (!fileds || fileds.length === 0) {
      return NextResponse.json(neighborhoods)
    }

    const result = neighborhoods.map(neigh => {
      const filteredItem = {}
      for (const field of fileds) {
        if (field in neigh) {
          filteredItem[field] = neigh[field]
        } else {
          return { error: `Field ${field} not found` }
        }
      }
      return filteredItem
    })

    const errorResult = result.find(item => item.error)
    if (errorResult) {
      return NextResponse.json({ error: errorResult.error }, { status: 404 })
    }

    return NextResponse.json(result)
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
