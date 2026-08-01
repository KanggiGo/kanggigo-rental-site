import { getTranslations } from "next-intl/server";
import { faqJsonLd } from "@/lib/seo";

export default async function Faq({
  locale,
  showHeading = true,
}: {
  locale: string;
  showHeading?: boolean;
}) {
  const tHome = await getTranslations({ locale, namespace: "Home" });
  const t = await getTranslations({ locale, namespace: "FAQPage" });

  const items = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
    { q: t("q6"), a: t("a6") },
    { q: t("q7"), a: t("a7") },
    { q: t("q8"), a: t("a8") },
    { q: t("q9"), a: t("a9") },
  ];

  return (
    <section className="bg-surface py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: faqJsonLd(items.map((item) => ({ question: item.q, answer: item.a }))),
        }}
      />
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        {showHeading && (
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-ink sm:text-3xl">{tHome("faqTitle")}</h2>
            <p className="mt-2 text-muted">{tHome("faqSubtitle")}</p>
          </div>
        )}

        <div className="mt-8 space-y-3">
          {items.map((item) => (
            <details key={item.q} className="group rounded-xl border border-border bg-white p-4 shadow-sm">
              <summary className="cursor-pointer list-none font-heading text-sm font-semibold text-ink marker:content-none">
                <span className="flex items-center justify-between gap-2">
                  {item.q}
                  <span className="shrink-0 text-muted transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
