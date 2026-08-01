"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { locationFormSchema, type LocationFormValues } from "@/lib/validations";
import type { ActionResult } from "./bikes";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

function toPrismaData(values: LocationFormValues) {
  const en = values.translations.find((t) => t.locale === "en")!;
  return {
    name: en.name,
    slug: values.slug,
    description: en.description,
    isAirport: values.isAirport,
    deliveryNote: values.deliveryNote,
  };
}

export async function createLocation(raw: LocationFormValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = locationFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const values = parsed.data;

  try {
    const location = await prisma.location.create({
      data: {
        ...toPrismaData(values),
        translations: { create: values.translations },
      },
    });
    revalidatePath("/admin/locations");
    return { success: true, id: location.id };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { success: false, error: "That slug is already in use." };
    }
    return { success: false, error: "Something went wrong while saving." };
  }
}

export async function updateLocation(id: string, raw: LocationFormValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = locationFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const values = parsed.data;

  try {
    await prisma.$transaction([
      prisma.locationTranslation.deleteMany({ where: { locationId: id } }),
      prisma.location.update({
        where: { id },
        data: {
          ...toPrismaData(values),
          translations: { create: values.translations },
        },
      }),
    ]);
    revalidatePath("/admin/locations");
    return { success: true, id };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { success: false, error: "That slug is already in use." };
    }
    return { success: false, error: "Something went wrong while saving." };
  }
}

export async function deleteLocation(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.location.delete({ where: { id } });
    revalidatePath("/admin/locations");
    return { success: true, id };
  } catch {
    return { success: false, error: "Could not delete this location." };
  }
}
