import type { BikeCategory, Transmission } from "@prisma/client";
import type { BikeSort } from "./bikes";

export type ParsedSearchParams = {
  category?: BikeCategory;
  transmission?: Transmission;
  minPrice?: number;
  maxPrice?: number;
  sort?: BikeSort;
  page: number;
};

const VALID_CATEGORIES = ["SCOOTER_AUTOMATIC", "MANUAL", "ADVENTURE", "ELECTRIC"];
const VALID_TRANSMISSIONS = ["AUTOMATIC", "MANUAL"];

export function parseSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): ParsedSearchParams {
  const get = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const categoryRaw = get("category");
  const category = VALID_CATEGORIES.includes(categoryRaw ?? "")
    ? (categoryRaw as BikeCategory)
    : undefined;

  const transmissionRaw = get("transmission");
  const transmission = VALID_TRANSMISSIONS.includes(transmissionRaw ?? "")
    ? (transmissionRaw as Transmission)
    : undefined;

  const minPrice = get("minPrice") ? Number(get("minPrice")) : undefined;
  const maxPrice = get("maxPrice") ? Number(get("maxPrice")) : undefined;
  const sortRaw = get("sort");
  const sort: BikeSort | undefined =
    sortRaw === "price-asc" || sortRaw === "price-desc" || sortRaw === "newest" ? sortRaw : undefined;
  const page = get("page") ? Math.max(1, Number(get("page"))) : 1;

  return { category, transmission, minPrice, maxPrice, sort, page };
}

export function toFlatSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): Record<string, string | undefined> {
  const flat: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(searchParams)) {
    flat[key] = Array.isArray(value) ? value[0] : value;
  }
  return flat;
}
