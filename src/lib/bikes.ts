import { cache } from "react";
import { Prisma, BikeCategory, Transmission, BikeStatus } from "@prisma/client";
import { prisma } from "./prisma";

const PAGE_SIZE = 9;

const bikeWithRelations = Prisma.validator<Prisma.BikeDefaultArgs>()({
  include: {
    translations: true,
    images: { orderBy: { sortOrder: "asc" } },
  },
});
export type BikeWithRelations = Prisma.BikeGetPayload<typeof bikeWithRelations>;

export type LocalizedBike = Omit<BikeWithRelations, "translations"> & {
  name: string;
  description: string;
};

export function localizeBike(bike: BikeWithRelations, locale: string): LocalizedBike {
  const { translations, ...rest } = bike;
  const match = translations.find((t) => t.locale === locale);
  return {
    ...rest,
    name: match?.name ?? bike.name,
    description: match?.description ?? bike.description,
  };
}

export type BikeSort = "newest" | "price-asc" | "price-desc";

export type BikeFilters = {
  category?: BikeCategory;
  transmission?: Transmission;
  minPrice?: number;
  maxPrice?: number;
  sort?: BikeSort;
  page?: number;
};

function buildWhere(filters: BikeFilters): Prisma.BikeWhereInput {
  const where: Prisma.BikeWhereInput = {
    status: BikeStatus.AVAILABLE,
  };

  if (filters.category) where.category = filters.category;
  if (filters.transmission) where.transmission = filters.transmission;

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.pricePerDay = {
      ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
    };
  }

  return where;
}

function buildOrderBy(sort?: BikeSort): Prisma.BikeOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { pricePerDay: "asc" };
    case "price-desc":
      return { pricePerDay: "desc" };
    default:
      return { createdAt: "desc" };
  }
}

export async function getListingBikes(filters: BikeFilters, locale: string) {
  const where = buildWhere(filters);
  const page = Math.max(1, filters.page ?? 1);

  const [rows, total] = await Promise.all([
    prisma.bike.findMany({
      where,
      include: bikeWithRelations.include,
      orderBy: buildOrderBy(filters.sort),
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.bike.count({ where }),
  ]);

  return {
    bikes: rows.map((row) => localizeBike(row, locale)),
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getFeaturedBikes(locale: string, take = 8) {
  const rows = await prisma.bike.findMany({
    where: { isFeatured: true, status: BikeStatus.AVAILABLE },
    include: bikeWithRelations.include,
    orderBy: { createdAt: "desc" },
    take,
  });
  return rows.map((row) => localizeBike(row, locale));
}

export const getBikeBySlug = cache(async (slug: string, locale: string) => {
  const row = await prisma.bike.findUnique({
    where: { slug },
    include: bikeWithRelations.include,
  });
  return row ? localizeBike(row, locale) : null;
});

export async function getSimilarBikes(bike: LocalizedBike, locale: string, take = 3) {
  const rows = await prisma.bike.findMany({
    where: {
      id: { not: bike.id },
      category: bike.category,
      status: BikeStatus.AVAILABLE,
    },
    include: bikeWithRelations.include,
    take,
  });
  return rows.map((row) => localizeBike(row, locale));
}
