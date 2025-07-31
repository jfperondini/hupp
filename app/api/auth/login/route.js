import { NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import fs from 'fs'
import path from 'path'

export async function POST (req) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    )
  }

  try {
    const filePath = path.resolve('public/hupp.json')

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'User data file not found' },
        { status: 404 }
      )
    }

    const fileContent = fs.readFileSync(filePath, 'utf8')
    let data
    try {
      data = JSON.parse(fileContent)
      if (!Array.isArray(data.user)) {
        console.error('`user` is not an array, initializing empty array.')
        data.user = []
      }
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError)
      return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
      )
    }

    const account = data.account.find(account => account.email === email)
    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    const passwordMatch = await compare(password, account.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    return NextResponse.json({ message: 'Login successful' }, { status: 200 })
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET () {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
}
