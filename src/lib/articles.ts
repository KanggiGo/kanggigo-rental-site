import { cache } from "react";
import { prisma } from "./prisma";

const PAGE_SIZE = 9;

export async function getPublishedArticles(page = 1) {
  const where = { isPublished: true };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.article.count({ where }),
  ]);

  return {
    articles,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export const getArticleBySlug = cache(async (slug: string) => {
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article || !article.isPublished) return null;
  return article;
});

export async function getRecentArticles(take = 3) {
  return prisma.article.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take,
  });
}

export async function getRelatedArticles(article: { id: string; category: string }, take = 3) {
  return prisma.article.findMany({
    where: { id: { not: article.id }, category: article.category, isPublished: true },
    orderBy: { publishedAt: "desc" },
    take,
  });
}
