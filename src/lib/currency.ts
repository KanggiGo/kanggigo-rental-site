import type { Currency } from "@prisma/client";

/**
 * Static exchange rates, units of each currency per 1 USD. USD is the pivot:
 * to convert A -> B we go A -> USD -> B. Update manually until a live rate
 * API is wired up post-MVP.
 */
export const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  IDR: 15800,
  EUR: 0.92,
  AUD: 1.53,
  GBP: 0.79,
};

export const CURRENCIES = Object.keys(EXCHANGE_RATES) as Currency[];

export function convertPrice(
  amount: number,
  from: Currency,
  to: Currency
): number {
  if (from === to) return amount;
  const amountInUsd = amount / EXCHANGE_RATES[from];
  return amountInUsd * EXCHANGE_RATES[to];
}

const CURRENCY_LOCALE_FALLBACK: Record<string, string> = {
  en: "en-US",
  id: "id-ID",
  ru: "ru-RU",
  fr: "fr-FR",
};

export function formatPrice(
  amount: number,
  currency: Currency,
  locale: string
): string {
  const intlLocale = CURRENCY_LOCALE_FALLBACK[locale] ?? locale;

  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
