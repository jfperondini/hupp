import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const filePath = path.resolve("public/hupp.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(fileData);

    const requestBody = await req.json();
    const name = requestBody.name;

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const city = jsonData.city.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );

    if (city) {
      const { id, name, description } = city;
      const result = { id, name, description };
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: "city not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}


