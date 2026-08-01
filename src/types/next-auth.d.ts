import type { DefaultSession } from "next-auth";
import type { AdminRole } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role: AdminRole;
  }
  interface Session {
    user: {
      id: string;
      role: AdminRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: AdminRole;
  }
}
