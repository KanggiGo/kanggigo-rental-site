import { getTranslations } from "next-intl/server";
import { ShieldIcon, TruckIcon, CashIcon, PhoneIcon } from "@/components/icons/Icons";

export default async function TrustSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "Home" });

  const items = [
    { icon: ShieldIcon, title: t("trustZeroDeposit"), body: t("trustZeroDepositBody") },
    { icon: TruckIcon, title: t("trustFreeDelivery"), body: t("trustFreeDeliveryBody") },
    { icon: CashIcon, title: t("trustSecure"), body: t("trustSecureBody") },
    { icon: PhoneIcon, title: t("trustRoadside"), body: t("trustRoadsideBody") },
  ];

  return (
    <section className="bg-sand py-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-white p-6 text-center shadow-sm">
              <item.icon className="mx-auto h-8 w-8 text-accent" />
              <h3 className="mt-3 font-heading text-base font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
