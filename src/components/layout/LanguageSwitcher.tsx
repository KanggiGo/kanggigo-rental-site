"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeNames } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const t = useTranslations("Language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">{t("label")}</span>
      <select
        aria-label={t("label")}
        value={locale}
        onChange={(e) => {
          router.replace(
            // @ts-expect-error - pathname/params typing is dynamic across routes
            { pathname, params },
            { locale: e.target.value }
          );
        }}
        className="cursor-pointer rounded-md border border-border bg-transparent px-2 py-1 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {localeNames[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
