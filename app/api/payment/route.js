import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const filePath = path.resolve("public/hupp.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(fileData);

    const { idBikeReservation, idBikeStation, paymentOption } =
      await req.json();

    if (!idBikeReservation) {
      return NextResponse.json(
        { error: "idBikeReservation is required" },
        { status: 400 }
      );
    }
    if (!idBikeStation) {
      return NextResponse.json(
        { error: "idBikeStation is required" },
        { status: 400 }
      );
    }
    if (!paymentOption) {
      return NextResponse.json(
        { error: "paymentOption is required" },
        { status: 400 }
      );
    }

    const bikeReservation = jsonData.bikeReservation.find(
      (reservation) => reservation.id === idBikeReservation
    );
    if (!bikeReservation) {
      return NextResponse.json(
        { error: "Bike reservation not found" },
        { status: 404 }
      );
    }

    const bikeStation = jsonData.city
      .flatMap((city) => city.neighborhood)
      .flatMap((neighborhood) => neighborhood.bikeStation)
      .find((station) => station.id === idBikeStation);

    if (!bikeStation) {
      return NextResponse.json(
        { error: "Bike station not found" },
        { status: 404 }
      );
    }

    if (
      bikeReservation.quantity >
      bikeStation.totalQuantity - bikeStation.availableQuantity
    ) {
      return NextResponse.json(
        { error: "Insufficient space to return all bikes" },
        { status: 404 }
      );
    } else {
      bikeStation.availableQuantity += bikeReservation.quantity;
    }

    const endTime = new Date(bikeReservation.endTime);
    const currentTime = new Date();
    let minutesPassed = Math.floor((currentTime - endTime) / (1000 * 60));

    minutesPassed = minutesPassed < 0 ? 0 : minutesPassed;

    let totalPayMinutesPassed = 0;
    if (minutesPassed > 0) {
      const perMinuteRate = jsonData.pricing.payPerRide.perMinuteRate;
      totalPayMinutesPassed = parseFloat(
        (perMinuteRate * minutesPassed * bikeReservation.quantity).toFixed(2)
      );
    }

    const startTime = new Date(bikeReservation.startTime);
    const differenceInMinutes = (endTime - startTime) / (1000 * 60);
    const perMinute = jsonData.pricing.payPerRide.perMinute;
    const totalPayForRide =
      differenceInMinutes * perMinute * bikeReservation.quantity;

    const gstRate = jsonData.pricing.systemSetting.taxes.gst;
    const pstRate = jsonData.pricing.systemSetting.taxes.pst;
    const totalAmount = totalPayMinutesPassed + totalPayForRide;
    const gstAmount = totalAmount * gstRate;
    const pstAmount = totalAmount * pstRate;
    const totalPayTaxes = parseFloat((gstAmount + pstAmount).toFixed(2));

    const newPayment = {
      id: uuidv4(),
      idBikeReservation,
      paymentOption,
      minutesPassed,
      totalPayMinutesPassed,
      totalPayForRide,
      totalPayTaxes,
    };

    jsonData.payment.push(newPayment);
    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));

    return NextResponse.json(
      {
        message: "Payment successfully created",
        payment: newPayment,
        updatedBikeStation: bikeStation,
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
