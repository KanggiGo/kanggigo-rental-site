import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ContactForm from "@/components/forms/ContactForm";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { buildAlternates, SITE_URL } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ContactPage" });
  const title = t("title");
  const description = t("intro");

  return {
    title,
    description,
    alternates: buildAlternates("/contact", locale),
    openGraph: { title, description, url: `${SITE_URL}/${locale}/contact`, type: "website" },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tFooter, tNav, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "ContactPage" }),
    getTranslations({ locale, namespace: "Footer" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Common" }),
  ]);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs
        locale={locale}
        items={[
          { name: tCommon("home"), href: "/" },
          { name: tNav("contact"), href: "/contact" },
        ]}
      />
      <h1 className="font-heading text-3xl font-bold text-ink">{t("title")}</h1>
      <p className="mt-3 leading-relaxed text-muted">{t("intro")}</p>

      <div className="mt-6">
        <WhatsAppButton message="Hi KanggiGo Rental, I have a question." label={tFooter("whatsapp")} />
      </div>

      <div className="mt-8 rounded-xl border border-border bg-white p-6">
        <ContactForm />
      </div>
    </div>
  );
}
