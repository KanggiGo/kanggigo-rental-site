"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import CurrencySwitcher from "@/components/currency/CurrencySwitcher";

const NAV_LINKS = [
  { href: "/bikes", key: "bikes" },
  { href: "/how-it-works", key: "howItWorks" },
  { href: "/locations", key: "locations" },
  { href: "/news", key: "news" },
  { href: "/faq", key: "faq" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export default function Header() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white-panel backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo priority />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`border-b-2 pb-0.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-accent text-primary"
                    : "border-transparent text-primary/80 hover:border-accent/60 hover:text-primary"
                }`}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <CurrencySwitcher />
          <LanguageSwitcher />
        </div>

        <button
          type="button"
          className="flex items-center justify-center rounded-md p-2 text-ink lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth="2">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-border px-4 pb-4 lg:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-primary/80 hover:bg-surface hover:text-primary"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex items-center gap-3 border-t border-border pt-3">
            <CurrencySwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
