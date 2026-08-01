export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const DATE_LOCALE_FALLBACK: Record<string, string> = {
  en: "en-US",
  id: "id-ID",
  ru: "ru-RU",
  fr: "fr-FR",
};

export function formatDate(date: Date, locale: string): string {
  const intlLocale = DATE_LOCALE_FALLBACK[locale] ?? locale;
  return new Intl.DateTimeFormat(intlLocale, { dateStyle: "long" }).format(date);
}
