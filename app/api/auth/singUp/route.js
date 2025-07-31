import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST (req) {
  const { email, password, firstName, lastName } = await req.json()

  if (!email || !password || !firstName || !lastName) {
    return NextResponse.json(
      { error: 'Email, password, firstName, and lastName are required' },
      { status: 400 }
    )
  }

  try {
    const hashedPassword = await hash(password, 10)
    const filePath = path.resolve('public/hupp.json')
    let data
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      try {
        data = JSON.parse(fileContent)
        if (!Array.isArray(data.user)) {
          console.error('`user` is not an array, initializing empty array.')
          data.user = []
        }
        if (!Array.isArray(data.account)) {
          console.error('`account` is not an array, initializing empty array.')
          data.account = []
        }
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError)
        data = { user: [], account: [] }
      }
    } else {
      data = { user: [], account: [] }
    }

    const userExists = data.user.some(user => user.email === email)
    const accountExists = data.account.some(account => account.email === email)
    if (userExists || accountExists) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    const newUser = {
      id: uuidv4(),
      email,
      firstName,
      lastName
    }
    data.user.push(newUser)

    const newAccount = {
      id: newUser.id,
      email,
      password: hashedPassword
    }
    data.account.push(newAccount)

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}



export async function GET () {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
}
