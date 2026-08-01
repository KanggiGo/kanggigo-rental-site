"use client";

import { convertPrice, formatPrice } from "@/lib/currency";
import { useDisplayCurrency } from "@/components/currency/CurrencyProvider";

type BikePriceProps = {
  /** Always USD-normalized in the DB, per lib/currency.ts. */
  price: number;
  locale: string;
  suffix?: string;
  className?: string;
  /** Show the USD-equivalent as secondary text when the selected currency isn't USD. */
  showUsdReference?: boolean;
};

export default function BikePrice({
  price,
  locale,
  suffix,
  className = "",
  showUsdReference = false,
}: BikePriceProps) {
  const { currency } = useDisplayCurrency();

  const converted = convertPrice(price, "USD", currency);
  const formatted = formatPrice(converted, currency, locale);
  const usdReference =
    showUsdReference && currency !== "USD" ? formatPrice(price, "USD", locale) : null;

  return (
    <span className={className}>
      {formatted}
      {suffix && <span className="text-sm font-normal text-muted"> {suffix}</span>}
      {usdReference && <span className="block text-xs font-normal text-muted">≈ {usdReference}</span>}
    </span>
  );
}
