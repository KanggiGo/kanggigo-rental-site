type IconProps = {
  className?: string;
};

const base = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export function ScooterIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="5.5" cy="18" r="2.5" />
      <circle cx="18.5" cy="18" r="2.5" />
      <path d="M8 18h8" />
      <path d="M5.5 18v-3.5a2 2 0 0 1 2-2H11l2.5-4H18" />
      <path d="M13 12.5 16 16h2.5" />
      <path d="M4 8.5h3" />
    </svg>
  );
}

export function EngineIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

export function SeatIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 20c0-3 1-5 3-5h8c2 0 3 2 3 5" />
      <circle cx="12" cy="7" r="3.5" />
    </svg>
  );
}

export function HelmetIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 16a8 8 0 0 1 16 0" />
      <path d="M4 16h16v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1Z" />
      <path d="M9 16v-2a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function LocationIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

export function StarIcon({ className, filled = true }: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7L12 3Z"
      />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3 4 6v6c0 4.5 3.2 7.7 8 9 4.8-1.3 8-4.5 8-9V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function TruckIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2" y="7" width="12" height="9" rx="1" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="6.5" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </svg>
  );
}

export function NewsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 4h13a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Z" />
      <path d="M17 19V6a1 1 0 0 0-1-1H6" />
      <path d="M7 8h7M7 11.5h7M7 15h4" />
    </svg>
  );
}

export function CashIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 9v.01M18 15v.01" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 3h3l1.5 4.5L8.5 9a10 10 0 0 0 6.5 6.5l1.5-2L21 15v3a2 2 0 0 1-2 2C11.8 20 4 12.2 4 5a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

export function WhatsappIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.2h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2zm0 18.11c-1.47 0-2.9-.4-4.15-1.14l-.3-.18-3.11.82.83-3.03-.19-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.53 3.69-8.22 8.19-8.22 2.19 0 4.24.85 5.79 2.4a8.13 8.13 0 0 1 2.4 5.8c0 4.53-3.7 8.22-8.2 8.22zm4.48-6.16c-.24-.13-1.45-.72-1.68-.8-.22-.08-.39-.13-.55.13-.16.25-.63.8-.78.96-.14.16-.28.18-.53.06-.24-.13-1.03-.38-1.96-1.22-.72-.65-1.21-1.44-1.35-1.69-.14-.25-.02-.38.11-.51.11-.11.24-.28.37-.42.12-.14.16-.25.24-.4.08-.16.04-.3-.02-.43-.06-.13-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.25-.84.83-.84 2.01 0 1.19.86 2.34.98 2.5.12.16 1.7 2.62 4.13 3.67.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.45-.6 1.65-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.16-.46-.28z" />
    </svg>
  );
}
