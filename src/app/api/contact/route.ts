import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactFormSchema } from "@/lib/validations";

/**
 * General contact-page leads are stored as a Booking with no bike/dates
 * attached, so they land in the same admin inbox as booking requests
 * instead of needing a second inbox for a handful of general questions.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const { name, email, phone, message } = parsed.data;
  const now = new Date();

  await prisma.booking.create({
    data: {
      customerName: name,
      email,
      phone: phone ?? "",
      message,
      startDate: now,
      endDate: now,
      source: "FORM",
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
