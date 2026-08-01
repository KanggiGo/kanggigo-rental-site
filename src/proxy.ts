import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { authConfig } from "@/lib/auth.config";
import { routing, locales } from "@/i18n/routing";

const { auth } = NextAuth(authConfig);
const intlMiddleware = createIntlMiddleware(routing);

export default auth((req) => {
  const segments = req.nextUrl.pathname.split("/").filter(Boolean);
  const hasLocalePrefix = (locales as readonly string[]).includes(segments[0]);
  const locale = hasLocalePrefix ? segments[0] : routing.defaultLocale;
  const rest = hasLocalePrefix ? segments.slice(1) : segments;

  const isAdminRoute = rest[0] === "admin";
  const isLoginRoute = isAdminRoute && rest[1] === "login";

  if (isAdminRoute && !isLoginRoute && !req.auth) {
    return NextResponse.redirect(new URL(`/${locale}/admin/login`, req.url));
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
