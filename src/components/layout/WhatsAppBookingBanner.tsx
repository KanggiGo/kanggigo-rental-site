import { WHATSAPP_NUMBER } from "@/lib/constants";
import { WhatsappIcon } from "@/components/icons/Icons";

/**
 * QR code is a pre-generated static SVG (public/whatsapp-qr.svg), built with
 * the `qrcode` npm package (a real QR encoder) rather than an AI-generated
 * image, and verified to decode back to the exact wa.me URL below at every
 * size this component renders it at. Regenerate it if the number changes.
 */
export default function WhatsAppBookingBanner({ className = "" }: { className?: string }) {
  const href = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Book your ride on WhatsApp: ${WHATSAPP_NUMBER}`}
      className={`group block bg-primary transition-colors hover:bg-primary-hover ${className}`}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-4 py-10 text-center sm:px-6 md:flex-row md:justify-between md:text-left lg:px-8">
        <div>
          <p className="font-heading text-xl font-bold tracking-wide text-white sm:text-2xl">
            BOOK YOUR RIDE ON WHATSAPP
          </p>
          <p className="mt-2 text-lg font-semibold text-accent">{WHATSAPP_NUMBER}</p>
        </div>

        {/* Desktop / tablet: QR code — scanning your own screen doesn't work on mobile */}
        <div className="hidden shrink-0 flex-col items-center gap-2 md:flex">
          <div className="rounded-xl bg-white p-3 shadow-sm">
            {/* Plain <img>, not next/image: local SVGs aren't optimized by
                default and this is already a small, static, pre-verified file. */}
            <img
              src="/whatsapp-qr.svg"
              alt="QR code linking to KanggiGo Rental on WhatsApp"
              width={140}
              height={140}
              className="h-[140px] w-[140px]"
            />
          </div>
          <span className="text-sm font-medium text-white/90">Scan to Book on WhatsApp</span>
        </div>

        {/* Mobile: big tappable button instead of a QR code */}
        <span className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-base font-semibold text-primary shadow-sm transition-transform group-active:scale-[0.98] md:hidden">
          <WhatsappIcon className="h-5 w-5" />
          Chat on WhatsApp
        </span>
      </div>
    </a>
  );
}
