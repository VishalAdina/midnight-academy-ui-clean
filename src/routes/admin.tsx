import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppNav } from "@/components/app-nav";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="min-h-screen">
      <AppNav admin />
      <Outlet />
    </div>
  );
}
