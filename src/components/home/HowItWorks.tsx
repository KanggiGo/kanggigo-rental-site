import { getTranslations } from "next-intl/server";

export default async function HowItWorks({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "Home" });

  const steps = [
    { title: t("step1Title"), body: t("step1Body") },
    { title: t("step2Title"), body: t("step2Body") },
    { title: t("step3Title"), body: t("step3Body") },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="font-heading text-2xl font-bold text-ink sm:text-3xl">{t("howItWorksTitle")}</h2>
        <p className="mt-2 text-muted">{t("howItWorksSubtitle")}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.title} className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-heading text-sm font-bold text-primary">
              {index + 1}
            </span>
            <h3 className="mt-4 font-heading text-lg font-semibold text-ink">{step.title}</h3>
            <p className="mt-2 text-sm text-muted">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
