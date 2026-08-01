import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe base config (no Credentials provider / Prisma / bcrypt) so it can
 * be used from the proxy/middleware runtime. The full config with the
 * Credentials provider lives in `auth.ts` and extends this one.
 */
export const authConfig = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [],
} satisfies NextAuthConfig;
