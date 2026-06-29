import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";
import { MouseAnimationBackground } from "./MouseAnimationBackground";

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-slate-100 text-foreground dark:from-slate-950 dark:via-slate-950 dark:to-black">
      <MouseAnimationBackground />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(240,199,2,0.18),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(15,23,42,0.08),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(240,199,2,0.12),transparent_30%)]" />

      <div className="relative z-10">
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close admin menu"
            className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:pl-64">
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
          <main className="min-h-screen px-4 pt-24 pb-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
