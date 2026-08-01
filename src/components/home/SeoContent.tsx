import { getTranslations } from "next-intl/server";

export default async function SeoContent({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "SeoContent" });

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="prose-content space-y-8">
        <div>
          <h2 className="font-heading text-xl font-bold text-ink sm:text-2xl">{t("howTitle")}</h2>
          <p className="mt-3 leading-relaxed text-muted">{t("howBody")}</p>
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-ink sm:text-2xl">{t("costTitle")}</h2>
          <p className="mt-3 leading-relaxed text-muted">{t("costBody")}</p>
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-ink sm:text-2xl">{t("fleetTitle")}</h2>
          <p className="mt-3 leading-relaxed text-muted">{t("fleetBody")}</p>
        </div>
      </div>
    </section>
  );
}
