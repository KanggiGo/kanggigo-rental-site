import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { locales } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";

// Generated per-request rather than at build time: the free-tier Postgres
// database suspends when idle, and a cold database at build time would fail
// the whole deploy. Sitemaps don't need to be static — crawlers re-fetch
// periodically regardless.
export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "",
  "/bikes",
  "/how-it-works",
  "/locations",
  "/faq",
  "/about",
  "/contact",
];

function withLanguages(path: string) {
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${SITE_URL}/${l}${path}`;
  }
  // Matches the `x-default` entry every page's <head> already sends via
  // buildAlternates() — keeps the sitemap's hreflang signal consistent
  // with the per-page one.
  languages["x-default"] = `${SITE_URL}/en${path}`;
  return languages;
}

// News content is English-only (no ArticleTranslation model yet). Sitemaps
// should only list canonical URLs, and every news page's own canonical
// already points at /en (see buildEnglishOnlyAlternates), so id/ru/fr news
// URLs are deliberately left out here rather than claiming translations
// that don't exist.
function englishOnlyLanguages(path: string) {
  const enUrl = `${SITE_URL}/en${path}`;
  return { en: enUrl, "x-default": enUrl };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [bikes, locations, articles] = await Promise.all([
    prisma.bike.findMany({ where: { status: "AVAILABLE" }, select: { slug: true, updatedAt: true } }),
    prisma.location.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.article.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.8,
        alternates: { languages: withLanguages(path) },
      });
    }

    for (const bike of bikes) {
      const path = `/bikes/${bike.slug}`;
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: bike.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: { languages: withLanguages(path) },
      });
    }

    for (const location of locations) {
      const path = `/locations/${location.slug}`;
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: location.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: { languages: withLanguages(path) },
      });
    }
  }

  // News listing + article pages: English-only content, so each gets a
  // single canonical entry instead of one per locale (see note above).
  entries.push({
    url: `${SITE_URL}/en/news`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
    alternates: { languages: englishOnlyLanguages("/news") },
  });

  for (const article of articles) {
    const path = `/news/${article.slug}`;
    entries.push({
      url: `${SITE_URL}/en${path}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: { languages: englishOnlyLanguages(path) },
    });
  }

  return entries;
}
