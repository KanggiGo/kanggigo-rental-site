"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export type FiltersState = {
  category?: string;
  transmission?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
};

export default function Filters({
  basePath,
  initial,
}: {
  basePath: string;
  initial: FiltersState;
}) {
  const t = useTranslations("Filters");
  const tCategory = useTranslations("BikeCategory");
  const tTransmission = useTranslations("Transmission");
  const router = useRouter();
  const [state, setState] = useState<FiltersState>(initial);

  const apply = () => {
    const params = new URLSearchParams();
    if (state.category) params.set("category", state.category);
    if (state.transmission) params.set("transmission", state.transmission);
    if (state.minPrice) params.set("minPrice", state.minPrice);
    if (state.maxPrice) params.set("maxPrice", state.maxPrice);
    if (state.sort) params.set("sort", state.sort);
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  };

  const reset = () => {
    setState({});
    router.push(basePath);
  };

  return (
    <aside className="w-full shrink-0 rounded-xl border border-border bg-white p-5 lg:w-72">
      <h2 className="font-heading text-lg font-semibold">{t("title")}</h2>

      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted" htmlFor="category-filter">
            {t("category")}
          </label>
          <select
            id="category-filter"
            value={state.category ?? ""}
            onChange={(e) => setState((s) => ({ ...s, category: e.target.value }))}
            className="mt-1 w-full rounded-md border border-border px-2 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">{t("any")}</option>
            <option value="SCOOTER_AUTOMATIC">{tCategory("SCOOTER_AUTOMATIC")}</option>
            <option value="MANUAL">{tCategory("MANUAL")}</option>
            <option value="ADVENTURE">{tCategory("ADVENTURE")}</option>
            <option value="ELECTRIC">{tCategory("ELECTRIC")}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted" htmlFor="transmission-filter">
            {t("transmission")}
          </label>
          <select
            id="transmission-filter"
            value={state.transmission ?? ""}
            onChange={(e) => setState((s) => ({ ...s, transmission: e.target.value }))}
            className="mt-1 w-full rounded-md border border-border px-2 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">{t("any")}</option>
            <option value="AUTOMATIC">{tTransmission("AUTOMATIC")}</option>
            <option value="MANUAL">{tTransmission("MANUAL")}</option>
          </select>
        </div>

        <div>
          <span className="block text-sm font-medium text-muted">{t("priceRange")}</span>
          <div className="mt-1 flex gap-2">
            <input
              type="number"
              min={0}
              placeholder={t("min")}
              value={state.minPrice ?? ""}
              onChange={(e) => setState((s) => ({ ...s, minPrice: e.target.value }))}
              className="w-1/2 rounded-md border border-border px-2 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <input
              type="number"
              min={0}
              placeholder={t("max")}
              value={state.maxPrice ?? ""}
              onChange={(e) => setState((s) => ({ ...s, maxPrice: e.target.value }))}
              className="w-1/2 rounded-md border border-border px-2 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted" htmlFor="sort-filter">
            {t("sortBy")}
          </label>
          <select
            id="sort-filter"
            value={state.sort ?? "newest"}
            onChange={(e) => setState((s) => ({ ...s, sort: e.target.value }))}
            className="mt-1 w-full rounded-md border border-border px-2 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="newest">{t("sortNewest")}</option>
            <option value="price-asc">{t("sortPriceAsc")}</option>
            <option value="price-desc">{t("sortPriceDesc")}</option>
          </select>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={apply}
            className="flex-1 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            {t("apply")}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-border px-3 py-2 text-sm font-medium text-ink hover:border-primary"
          >
            {t("reset")}
          </button>
        </div>
      </div>
    </aside>
  );
}
