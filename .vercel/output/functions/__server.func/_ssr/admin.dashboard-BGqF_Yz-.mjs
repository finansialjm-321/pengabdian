import { J as jsxRuntimeExports } from "./server-DqbPya7C.mjs";
import { L as Link, c as createLucideIcon } from "./router-stYq-Lqq.mjs";
import { u as useQuery } from "./useQuery-DUQ1Z3FV.mjs";
import { s as supabase } from "./client-aaA1sfNs.mjs";
import { A as AdminLayout } from "./AdminLayout-BvAayTFP.mjs";
import { N as Newspaper } from "./useAuth-DnuUE_hg.mjs";
import { C as Calendar } from "./calendar-D2JeG6P7.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode);
function Dashboard() {
  const {
    data: total
  } = useQuery({
    queryKey: ["news-count"],
    queryFn: async () => {
      const {
        count,
        error
      } = await supabase.from("news").select("*", {
        count: "exact",
        head: true
      });
      if (error) throw error;
      return count ?? 0;
    }
  });
  const {
    data: latest
  } = useQuery({
    queryKey: ["news-latest"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("news").select("id, title, news_date").order("created_at", {
        ascending: false
      }).limit(5);
      if (error) throw error;
      return data;
    }
  });
  const stats = [{
    label: "Total Berita",
    value: total ?? "—",
    icon: Newspaper,
    accent: "bg-primary-soft text-primary"
  }, {
    label: "Berita Bulan Ini",
    value: latest?.filter((n) => new Date(n.news_date).getMonth() === (/* @__PURE__ */ new Date()).getMonth()).length ?? "—",
    icon: Calendar,
    accent: "bg-accent text-accent-foreground"
  }, {
    label: "Status",
    value: "Aktif",
    icon: TrendingUp,
    accent: "bg-emerald-100 text-emerald-700"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Dashboard", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-10 w-10 items-center justify-center rounded-lg ${s.accent}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-5 w-5" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-extrabold tracking-tight", children: s.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm text-muted-foreground", children: s.label })
      ] })
    ] }, s.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold", children: "Berita Terbaru" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/news", className: "text-sm font-medium text-primary hover:underline", children: "Kelola →" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 divide-y divide-border", children: latest && latest.length > 0 ? latest.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-1 text-sm font-medium", children: n.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(n.news_date).toLocaleDateString("id-ID") })
      ] }, n.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-6 text-center text-sm text-muted-foreground", children: "Belum ada berita." }) })
    ] })
  ] });
}
export {
  Dashboard as component
};
