"use client";

import { useTranslations } from "next-intl";
import type { Currency } from "@prisma/client";
import { CURRENCIES } from "@/lib/currency";
import { useDisplayCurrency } from "./CurrencyProvider";

export default function CurrencySwitcher() {
  const t = useTranslations("Currency");
  const { currency, setCurrency } = useDisplayCurrency();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">{t("label")}</span>
      <select
        aria-label={t("label")}
        value={currency}
        onChange={(e) => setCurrency(e.target.value as Currency)}
        className="cursor-pointer rounded-md border border-border bg-transparent px-2 py-1 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        {CURRENCIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </label>
  );
}
