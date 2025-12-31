import { Suspense } from "react";
import AdminLayoutClient from "./AdminLayoutClient";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black text-white">
          Loading admin layout...
        </div>
      }
    >
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </Suspense>
  );
}
