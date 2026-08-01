"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bikeFormSchema, type BikeFormValues } from "@/lib/validations";

export type ActionResult = { success: true; id: string } | { success: false; error: string };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

function toPrismaData(values: BikeFormValues) {
  const en = values.translations.find((t) => t.locale === "en")!;
  return {
    name: en.name,
    slug: values.slug,
    description: en.description,
    brand: values.brand,
    category: values.category,
    transmission: values.transmission,
    engineCc: values.engineCc,
    seats: values.seats,
    helmetsIncluded: values.helmetsIncluded,
    pricePerDay: values.pricePerDay,
    pricePerWeek: values.pricePerWeek,
    pricePerMonth: values.pricePerMonth,
    currency: values.currency,
    status: values.status,
    isFeatured: values.isFeatured,
  };
}

export async function createBike(raw: BikeFormValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = bikeFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const values = parsed.data;

  try {
    const bike = await prisma.bike.create({
      data: {
        ...toPrismaData(values),
        translations: { create: values.translations },
        images: { create: values.images },
      },
    });

    revalidatePath("/admin/bikes");
    return { success: true, id: bike.id };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { success: false, error: "That slug is already in use." };
    }
    return { success: false, error: "Something went wrong while saving." };
  }
}

export async function updateBike(id: string, raw: BikeFormValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = bikeFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const values = parsed.data;

  try {
    await prisma.$transaction([
      prisma.bikeTranslation.deleteMany({ where: { bikeId: id } }),
      prisma.bikeImage.deleteMany({ where: { bikeId: id } }),
      prisma.bike.update({
        where: { id },
        data: {
          ...toPrismaData(values),
          translations: { create: values.translations },
          images: { create: values.images },
        },
      }),
    ]);

    revalidatePath("/admin/bikes");
    revalidatePath(`/admin/bikes/${id}`);
    return { success: true, id };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { success: false, error: "That slug is already in use." };
    }
    return { success: false, error: "Something went wrong while saving." };
  }
}

export async function deleteBike(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.bike.delete({ where: { id } });
    revalidatePath("/admin/bikes");
    return { success: true, id };
  } catch {
    return { success: false, error: "Could not delete this bike." };
  }
}
