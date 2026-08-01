import { Link } from "@/i18n/navigation";
import { breadcrumbJsonLd, SITE_URL } from "@/lib/seo";

export type BreadcrumbItem = { name: string; href: string };

/**
 * Renders visible breadcrumb navigation plus a matching BreadcrumbList
 * JSON-LD block (search engines use this for breadcrumb rich snippets).
 * `href` values are locale-relative paths (e.g. "/bikes/honda-scoopy-110");
 * the JSON-LD absolute URLs are built from the current locale.
 */
export default function Breadcrumbs({
  items,
  locale,
}: {
  items: BreadcrumbItem[];
  locale: string;
}) {
  const schemaItems = items.map((item) => ({
    name: item.name,
    url: `${SITE_URL}/${locale}${item.href === "/" ? "" : item.href}`,
  }));

  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd(schemaItems) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-1.5">
            {index > 0 && <span aria-hidden="true">/</span>}
            {index === items.length - 1 ? (
              <span aria-current="page" className="font-medium text-ink">
                {item.name}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-primary hover:underline">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
