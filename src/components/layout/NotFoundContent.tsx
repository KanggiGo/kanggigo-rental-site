import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFoundContent() {
  const t = await getTranslations("NotFound");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <p className="text-sm font-semibold tracking-widest text-muted">404</p>
      <h1 className="font-heading text-2xl font-bold text-ink sm:text-3xl">{t("title")}</h1>
      <p className="max-w-md text-muted">{t("body")}</p>
      <Link
        href="/"
        className="mt-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
      >
        {t("cta")}
      </Link>
    </div>
  );
}
