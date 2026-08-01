"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "./bikes";
import type { BookingStatus } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.booking.update({
      where: { id },
      data: { status, contactedAt: status === "NEW" ? null : new Date() },
    });
    revalidatePath("/admin/bookings");
    return { success: true, id };
  } catch {
    return { success: false, error: "Could not update this booking." };
  }
}
