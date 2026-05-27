import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/AdminLayout";
import { Newspaper, Calendar, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { data: total } = useQuery({
    queryKey: ["news-count"],
    queryFn: async () => {
      const { count, error } = await supabase.from("news").select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });

  const { data: latest } = useQuery({
    queryKey: ["news-latest"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("id, title, news_date")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const stats = [
    { label: "Total Berita", value: total ?? "—", icon: Newspaper, accent: "bg-primary-soft text-primary" },
    { label: "Berita Bulan Ini", value: latest?.filter(n => new Date(n.news_date).getMonth() === new Date().getMonth()).length ?? "—", icon: Calendar, accent: "bg-accent text-accent-foreground" },
    { label: "Status", value: "Aktif", icon: TrendingUp, accent: "bg-emerald-100 text-emerald-700" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.accent}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold tracking-tight">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Berita Terbaru</h2>
          <Link to="/admin/news" className="text-sm font-medium text-primary hover:underline">
            Kelola →
          </Link>
        </div>
        <div className="mt-4 divide-y divide-border">
          {latest && latest.length > 0 ? (
            latest.map((n) => (
              <div key={n.id} className="flex items-center justify-between py-3">
                <span className="line-clamp-1 text-sm font-medium">{n.title}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(n.news_date).toLocaleDateString("id-ID")}
                </span>
              </div>
            ))
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">Belum ada berita.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
