import { getTranslations } from "next-intl/server";
import Filters, { type FiltersState } from "./Filters";
import BikeGrid from "./BikeGrid";
import Pagination from "./Pagination";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { getListingBikes } from "@/lib/bikes";
import type { ParsedSearchParams } from "@/lib/listing-params";

export default async function ListingPageContent({
  locale,
  basePath,
  title,
  params,
  flatSearchParams,
}: {
  locale: string;
  basePath: string;
  title: string;
  params: ParsedSearchParams;
  flatSearchParams: Record<string, string | undefined>;
}) {
  const tFilters = await getTranslations({ locale, namespace: "Filters" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  const { bikes, total, page, totalPages } = await getListingBikes(
    {
      category: params.category,
      transmission: params.transmission,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      sort: params.sort,
      page: params.page,
    },
    locale
  );

  const filtersInitial: FiltersState = {
    category: flatSearchParams.category,
    transmission: flatSearchParams.transmission,
    minPrice: flatSearchParams.minPrice,
    maxPrice: flatSearchParams.maxPrice,
    sort: flatSearchParams.sort,
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        locale={locale}
        items={[
          { name: tCommon("home"), href: "/" },
          { name: title, href: basePath },
        ]}
      />
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-ink sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted">{tFilters("resultsCount", { count: total })}</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <Filters basePath={basePath} initial={filtersInitial} />

        <div className="flex-1">
          <BikeGrid bikes={bikes} locale={locale} />
          <Pagination
            page={page}
            totalPages={totalPages}
            locale={locale}
            basePath={basePath}
            searchParams={flatSearchParams}
          />
        </div>
      </div>
    </div>
  );
}
