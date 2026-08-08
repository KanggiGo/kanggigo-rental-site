import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppBookingBanner from "@/components/layout/WhatsAppBookingBanner";
import { CurrencyProvider } from "@/components/currency/CurrencyProvider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <WhatsAppBookingBanner />
      <Footer />
    </CurrencyProvider>
  );
}
