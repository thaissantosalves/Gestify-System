import AdminShell from "@/components/admin/AdminShell";
import { AppStoreProvider } from "@/components/providers/AppStoreProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppStoreProvider>
      <AdminShell>{children}</AdminShell>
    </AppStoreProvider>
  );
}
