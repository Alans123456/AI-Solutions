import { BarChart3, BriefcaseBusiness, Code2, FileText, FolderKanban, Home, MessageSquare, Settings, UserCog } from "lucide-react";
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

export function AdminSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const visibleNavigation = navigation.filter((item) => !item.adminOnly || user?.role === "admin");

  return (
    <div className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-white/20 bg-white/70 shadow-2xl shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 lg:block">
      <div className="flex h-16 items-center border-b border-white/20 px-6 dark:border-white/10">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg shadow-yellow-500/20">
            <Code2 className="h-5 w-5 text-slate-950" />
          </div>
          <span className="text-xl font-black text-slate-950 dark:text-white">Admin Panel</span>
        </Link>
      </div>

      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {visibleNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
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
            className="group flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-white/80 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <Home className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-amber-500" />
            Back to Website
          </Link>
        </div>
      </nav>
    </div>
  );
}
