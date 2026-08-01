import { defineRouting } from "next-intl/routing";

export const locales = ["en", "id", "ru", "fr"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  id: "Indonesia",
  ru: "Русский",
  fr: "Français",
};

export const defaultLocale: Locale = "en";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});
