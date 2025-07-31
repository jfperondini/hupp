import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const filePath = path.resolve("public/hupp.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(fileData);

    const { userId, bikeStationId, quantity, time } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "user id is required" },
        { status: 400 }
      );
    }

    if (!bikeStationId) {
      return NextResponse.json(
        { error: "id bike station is required" },
        { status: 400 }
      );
    }

    if (!quantity) {
      return NextResponse.json(
        { error: "quantity is required" },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { error: "quantity must be a positive number" },
        { status: 400 }
      );
    }

    if (!time) {
      return NextResponse.json({ error: "time is required" }, { status: 400 });
    }

    if (time < 3 || time < 0) {
      return NextResponse.json(
        {
          error: "time must be a number greater than 3 and cannot be negative",
        },
        { status: 400 }
      );
    }

    let bikeStation;
    const bikeStationExists = jsonData.city.some((city) =>
      city.neighborhood.some((neighborhood) =>
        neighborhood.bikeStation.some((station) => {
          if (station.id === bikeStationId) {
            bikeStation = station;
            return true;
          }
          return false;
        })
      )
    );

    if (!bikeStationExists) {
      return NextResponse.json(
        { error: "The specified bike station does not exist" },
        { status: 404 }
      );
    }

    if (bikeStation.availableQuantity < quantity) {
      return NextResponse.json(
        {
          error: "Not enough bikes available at the selected station",
          availableQuantity: bikeStation.availableQuantity,
        },
        { status: 400 }
      );
    }

    const reservationId = uuidv4();

    const startTime = new Date();

    const endTime = new Date(startTime.getTime() + time * 60000);

    const toLocalISO = (date) => {
      const timezoneOffset = date.getTimezoneOffset();
      return new Date(date.getTime() - timezoneOffset * 60000)
        .toISOString()
        .replace("Z", "");
    };

    const startTimeISO = toLocalISO(startTime);
    const endTimeISO = toLocalISO(endTime);

    const newReservation = {
      id: reservationId,
      userId,
      bikeStationId,
      quantity,
      startTime: startTimeISO,
      endTime: endTimeISO,
    };

    jsonData.bikeReservation.push(newReservation);

    bikeStation.availableQuantity -= quantity;

    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));

    return NextResponse.json(
      {
        message: "Reservation successfully created",
        reservation: newReservation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
