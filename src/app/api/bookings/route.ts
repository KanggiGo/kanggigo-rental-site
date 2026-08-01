import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingFormSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bookingFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const { bikeId, customerName, email, phone, pickupLocationId, dropoffLocationId, startDate, endDate, message } =
    parsed.data;

  const bike = await prisma.bike.findUnique({ where: { id: bikeId } });
  if (!bike) {
    return NextResponse.json({ error: "invalid_bike" }, { status: 400 });
  }

  await prisma.booking.create({
    data: {
      bikeId,
      customerName,
      email,
      phone,
      pickupLocationId,
      dropoffLocationId: dropoffLocationId ?? null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      message: message ?? "",
      source: "FORM",
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
