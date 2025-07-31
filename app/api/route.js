import { NextResponse } from "next/server";

export async function GET () {
  const api = {
    name: 'JSON Server',
    type: '✧*｡٩(ˊᗜˋ*)و✧*｡'
  }
  return NextResponse.json(api)
}
