"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { articleFormSchema, type ArticleFormValues } from "@/lib/validations";
import type { ActionResult } from "./bikes";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

function toPrismaData(values: ArticleFormValues) {
  return {
    slug: values.slug,
    title: values.title,
    excerpt: values.excerpt,
    body: values.body,
    coverImageUrl: values.coverImageUrl,
    category: values.category,
    isPublished: values.isPublished,
    publishedAt: new Date(values.publishedAt),
  };
}

export async function createArticle(raw: ArticleFormValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = articleFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const article = await prisma.article.create({ data: toPrismaData(parsed.data) });
    revalidatePath("/admin/articles");
    revalidatePath("/news");
    return { success: true, id: article.id };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { success: false, error: "That slug is already in use." };
    }
    return { success: false, error: "Something went wrong while saving." };
  }
}

export async function updateArticle(id: string, raw: ArticleFormValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = articleFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await prisma.article.update({ where: { id }, data: toPrismaData(parsed.data) });
    revalidatePath("/admin/articles");
    revalidatePath(`/admin/articles/${id}`);
    revalidatePath("/news");
    return { success: true, id };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { success: false, error: "That slug is already in use." };
    }
    return { success: false, error: "Something went wrong while saving." };
  }
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.article.delete({ where: { id } });
    revalidatePath("/admin/articles");
    revalidatePath("/news");
    return { success: true, id };
  } catch {
    return { success: false, error: "Could not delete this article." };
  }
}
