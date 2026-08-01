import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/admin/login`);
  }

  return (
    <div className="flex flex-1 flex-col bg-surface">
      <AdminNav locale={locale} userName={session.user.name ?? session.user.email ?? "Admin"} />
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
