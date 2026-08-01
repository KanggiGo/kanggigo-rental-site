"use client";

import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/bikes", label: "Bikes" },
  { href: "/admin/locations", label: "Locations" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/articles", label: "Articles" },
];

export default function AdminNav({ locale, userName }: { locale: string; userName: string }) {
  const pathname = usePathname();

  return (
    <header className="border-b border-white/10 bg-primary text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-1">
          {LINKS.map((link) => {
            const href = `/${locale}${link.href}`;
            const active = pathname === href;
            return (
              <Link
                key={link.href}
                href={href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  active ? "bg-white text-primary" : "text-white/80 hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 text-sm text-white/70">
          <span>{userName}</span>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: `/${locale}/admin/login` })}
            className="rounded-md border border-white/20 px-3 py-1.5 font-medium hover:bg-white/10"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
