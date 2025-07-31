import { NextResponse } from "next/server";
import fs from 'fs/promises'
import path from 'path'

export async function GET () {
  try {
    const filePath = path.resolve('public/hupp.json')
    const fileData = await fs.readFile(filePath, 'utf-8')
    const jsonData = JSON.parse(fileData)

    const { bikeType, image } = jsonData

    bikeType.forEach(bike => {
      bike.img = bike.img.map(imgId => image.find(img => img.id === imgId))
    })

    return NextResponse.json(bikeType)
  } catch (error) {
    console.error('Error reading file:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
