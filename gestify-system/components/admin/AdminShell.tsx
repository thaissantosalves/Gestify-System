import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Header />
        <main className="admin-content bg-main">{children}</main>
      </div>
    </div>
  );
}
