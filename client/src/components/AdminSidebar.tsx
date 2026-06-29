import { BarChart3, BriefcaseBusiness, Code2, FileText, FolderKanban, Home, MessageSquare, Settings, UserCog, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { name: "Content", href: "/admin/content", icon: FileText },
  { name: "Services", href: "/admin/services", icon: Settings },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Applications", href: "/admin/applications", icon: BriefcaseBusiness },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Users", href: "/admin/users", icon: UserCog, adminOnly: true }
];

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const visibleNavigation = navigation.filter((item) => !item.adminOnly || user?.role === "admin");

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 max-w-[82vw] border-r border-white/20 bg-white/95 shadow-2xl shadow-black/20 backdrop-blur-xl transition-transform duration-300 dark:border-white/10 dark:bg-slate-950/95 lg:w-64 lg:translate-x-0 lg:bg-white/70 lg:shadow-black/5 lg:dark:bg-slate-950/70",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center border-b border-white/20 px-6 dark:border-white/10">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg shadow-yellow-500/20">
            <Code2 className="h-5 w-5 text-slate-950" />
          </div>
          <span className="text-xl font-black text-slate-950 dark:text-white">Admin Panel</span>
        </Link>
        <button
          type="button"
          aria-label="Close admin menu"
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-950/10 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white lg:hidden"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {visibleNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                  isActive
                    ? "bg-slate-950 text-white shadow-lg shadow-black/10 dark:bg-white dark:text-slate-950"
                    : "text-slate-600 hover:bg-white/80 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                )}
              >
                <item.icon className={cn("mr-3 h-5 w-5 flex-shrink-0", isActive ? "text-amber-300 dark:text-amber-600" : "text-slate-400 group-hover:text-amber-500")} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 border-t border-white/20 pt-6 dark:border-white/10">
          <Link
            to="/"
            onClick={onClose}
            className="group flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-white/80 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <Home className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-amber-500" />
            Back to Website
          </Link>
        </div>
      </nav>
    </aside>
  );
}
