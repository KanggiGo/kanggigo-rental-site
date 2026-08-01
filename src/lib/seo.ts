import { locales, type Locale } from "@/i18n/routing";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Builds the `alternates` metadata block (canonical + hreflang) for a given
 * locale-agnostic path (e.g. "/bikes/honda-scoopy-110"). `x-default` points
 * at the English version, per Google's guidance for untargeted/unmatched locales.
 */
export function buildAlternates(pathname: string, locale: string) {
  const path = pathname === "/" ? "" : pathname;

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${SITE_URL}/${l}${path}`;
  }
  languages["x-default"] = `${SITE_URL}/en${path}`;

  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages,
  };
}

export function isValidLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}

/**
 * News articles exist in English only (no ArticleTranslation model yet), so
 * unlike buildAlternates() this doesn't claim id/ru/fr hreflang alternates
 * that don't exist — every locale's article page canonicalizes to the
 * English URL, avoiding duplicate-content signals across locale prefixes.
 */
export function buildEnglishOnlyAlternates(pathname: string) {
  const enUrl = `${SITE_URL}/en${pathname}`;
  return {
    canonical: enUrl,
    languages: { en: enUrl, "x-default": enUrl },
  };
}

/**
 * Truncates to `maxLength`, backing up to the last word boundary so meta
 * descriptions never cut off mid-word in search results.
 */
export function truncateForMeta(text: string, maxLength = 155): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

/** Renders a JSON-LD structured-data object as a `<script>` tag's inner JSON string. */
export function jsonLd(data: JsonLdValue): string {
  return JSON.stringify(data);
}

export function organizationJsonLd() {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#organization`,
    name: "KanggiGo Rental",
    description:
      "Scooter and motorbike rental in Bali with free delivery, zero deposit, and roadside assistance.",
    url: SITE_URL,
    areaServed: {
      "@type": "Place",
      name: "Bali, Indonesia",
    },
    priceRange: "$$",
  });
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  });
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

export function newsArticleJsonLd({
  headline,
  description,
  url,
  image,
  datePublished,
  dateModified,
}: {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified: string;
}) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline,
    description,
    url,
    ...(image ? { image: [image] } : {}),
    datePublished,
    dateModified,
    author: { "@type": "Organization", name: "KanggiGo Rental" },
    publisher: {
      "@type": "Organization",
      name: "KanggiGo Rental",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo/kanggigo-rental-icon-1024.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  });
}

export function bikeProductJsonLd({
  name,
  description,
  url,
  image,
  pricePerDay,
  brand,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
  pricePerDay: number;
  brand: string;
}) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    brand: { "@type": "Brand", name: brand },
    ...(image ? { image } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: pricePerDay,
      availability: "https://schema.org/InStock",
      url,
    },
  });
}
