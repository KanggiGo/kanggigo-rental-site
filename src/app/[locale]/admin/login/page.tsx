import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";
import Logo from "@/components/layout/Logo";

export const metadata: Metadata = { title: "Admin sign in" };

export default async function AdminLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (session?.user) {
    redirect(`/${locale}/admin`);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-primary px-4 py-16">
      <Logo variant="reversed" />
      <LoginForm callbackUrl={`/${locale}/admin`} />
    </div>
  );
}
