import { WHATSAPP_NUMBER } from "@/lib/constants";
import { WhatsappIcon } from "@/components/icons/Icons";

type WhatsAppButtonProps = {
  message: string;
  label: string;
  className?: string;
};

export default function WhatsAppButton({
  message,
  label,
  className = "",
}: WhatsAppButtonProps) {
  const href = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp ${className}`}
    >
      <WhatsappIcon className="h-4 w-4" />
      {label}
    </a>
  );
}
