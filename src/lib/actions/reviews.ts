"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reviewFormSchema, type ReviewFormValues } from "@/lib/validations";
import type { ActionResult } from "./bikes";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

export async function createReview(raw: ReviewFormValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = reviewFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const review = await prisma.review.create({ data: parsed.data });
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true, id: review.id };
  } catch {
    return { success: false, error: "Something went wrong while saving." };
  }
}

export async function updateReview(id: string, raw: ReviewFormValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = reviewFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await prisma.review.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true, id };
  } catch {
    return { success: false, error: "Something went wrong while saving." };
  }
}

export async function deleteReview(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.review.delete({ where: { id } });
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true, id };
  } catch {
    return { success: false, error: "Could not delete this review." };
  }
}
