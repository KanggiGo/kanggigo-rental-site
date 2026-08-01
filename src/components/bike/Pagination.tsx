import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function Pagination({
  page,
  totalPages,
  locale,
  basePath,
  searchParams,
}: {
  page: number;
  totalPages: number;
  locale: string;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;
  const t = await getTranslations({ locale, namespace: "Pagination" });

  const hrefFor = (targetPage: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== "page") params.set(key, value);
    }
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <nav className="mt-8 flex items-center justify-between gap-4">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-ink hover:border-primary">
          {t("previous")}
        </Link>
      ) : (
        <span />
      )}

      <p className="text-sm text-muted">{t("page", { current: page, total: totalPages })}</p>

      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-ink hover:border-primary">
          {t("next")}
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
