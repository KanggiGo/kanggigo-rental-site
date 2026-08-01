import { cache } from "react";
import { prisma } from "./prisma";

export async function getLocationBySlug(slug: string) {
  return prisma.location.findUnique({ where: { slug } });
}

export const getLocalizedLocationBySlug = cache(async (slug: string, locale: string) => {
  const location = await prisma.location.findUnique({
    where: { slug },
    include: { translations: true },
  });
  if (!location) return null;

  const { translations, ...rest } = location;
  const match = translations.find((t) => t.locale === locale);
  return {
    ...rest,
    name: match?.name ?? location.name,
    description: match?.description ?? location.description,
  };
});

export async function getAllLocations() {
  return prisma.location.findMany({ orderBy: { name: "asc" } });
}

export async function getPopularLocations(slugs: readonly string[]) {
  const locations = await prisma.location.findMany({
    where: { slug: { in: [...slugs] } },
  });
  return slugs
    .map((slug) => locations.find((l) => l.slug === slug))
    .filter((l): l is NonNullable<typeof l> => Boolean(l));
}

export type LocationOption = { id: string; name: string; slug: string };

export async function getLocationOptions(): Promise<LocationOption[]> {
  const locations = await getAllLocations();
  return locations.map((l) => ({ id: l.id, name: l.name, slug: l.slug }));
}
