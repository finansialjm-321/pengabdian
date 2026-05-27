import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Newspaper, LogOut, Map } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

// Di sini gw tambahin Manage Journeys pakai icon Map
const items = [
  { title: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Manage News", to: "/admin/news", icon: Newspaper },
  { title: "Manage Journeys", to: "/admin/journeys", icon: Map },
] as const;

export function AdminLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/admin/login" });
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout berhasil");
    navigate({ to: "/" });
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--gradient-warm)] text-primary-foreground">
            <Newspaper className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold">Admin Panel</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-6">
          {items.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col md:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
          <h1 className="text-lg font-bold">{title}</h1>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </header>
        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}