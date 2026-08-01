import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "./Logo";
import WhatsAppButton from "./WhatsAppButton";
import { POPULAR_LOCATION_SLUGS, CONTACT_EMAIL } from "@/lib/constants";

function slugToName(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");

  return (
    <footer className="mt-auto border-t border-border bg-primary text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="col-span-2 md:col-span-1">
          <Logo variant="reversed" />
          <p className="mt-4 text-sm text-white/70">{t("tagline")}</p>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold text-white">{t("exploreTitle")}</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li><Link href="/bikes" className="hover:text-white">{tNav("bikes")}</Link></li>
            <li><Link href="/how-it-works" className="hover:text-white">{tNav("howItWorks")}</Link></li>
            <li><Link href="/news" className="hover:text-white">{tNav("news")}</Link></li>
            <li><Link href="/faq" className="hover:text-white">{tNav("faq")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold text-white">{t("locationsTitle")}</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {POPULAR_LOCATION_SLUGS.map((slug) => (
              <li key={slug}>
                <Link href={`/locations/${slug}`} className="hover:text-white">
                  {slugToName(slug)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold text-white">{t("contactTitle")}</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li><Link href="/about" className="hover:text-white">{tNav("about")}</Link></li>
            <li><Link href="/contact" className="hover:text-white">{tNav("contact")}</Link></li>
            <li><a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">{CONTACT_EMAIL}</a></li>
          </ul>
          <div className="mt-4">
            <WhatsAppButton message="Hi KanggiGo Rental, I have a question." label={t("whatsapp")} />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/60 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} KanggiGo Rental. {t("rightsReserved")}
      </div>
    </footer>
  );
}
