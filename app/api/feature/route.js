import { NextResponse } from "next/server";
import fs from 'fs/promises'
import path from 'path'

export async function GET () {
  try {
    const filePath = path.resolve('public/hupp.json')
    const fileData = await fs.readFile(filePath, 'utf-8')
    const jsonData = JSON.parse(fileData)
    const feature = jsonData.feature
    return NextResponse.json(feature)
  } catch (error) {
    console.error('Error reading file:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}


