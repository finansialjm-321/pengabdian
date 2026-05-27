import { S as reactExports, J as jsxRuntimeExports } from "./server-DqbPya7C.mjs";
import { a as Route$5, L as Link } from "./router-stYq-Lqq.mjs";
import { u as useQuery } from "./useQuery-DUQ1Z3FV.mjs";
import { L as LoaderCircle, s as supabase } from "./client-aaA1sfNs.mjs";
import { C as ChevronLeft, a as ChevronRight, N as NewsCard } from "./NewsCard-CB6BS67N.mjs";
import { A as ArrowLeft } from "./arrow-left-GGB1ZSUJ.mjs";
import { C as Calendar } from "./calendar-D2JeG6P7.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function NewsDetailPage() {
  const {
    id
  } = Route$5.useParams();
  const [currentImageIndex, setCurrentImageIndex] = reactExports.useState(0);
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ["news", id],
    queryFn: async () => {
      const {
        data: data2,
        error: error2
      } = await supabase.from("news").select("*").eq("id", id).maybeSingle();
      if (error2) throw error2;
      return data2;
    }
  });
  const {
    data: related
  } = useQuery({
    queryKey: ["news-related", id],
    queryFn: async () => {
      const {
        data: data2,
        error: error2
      } = await supabase.from("news").select("id, title, description, image_url, news_date").neq("id", id).order("news_date", {
        ascending: false
      }).limit(3);
      if (error2) throw error2;
      return data2;
    }
  });
  const images = data?.image_gallery && data.image_gallery.length > 0 ? data.image_gallery : data?.image_url ? [data.image_url] : [];
  reactExports.useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
    }, 4e3);
    return () => clearInterval(timer);
  }, [images.length]);
  const nextImage = () => setCurrentImageIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
  const prevImage = () => setCurrentImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[60vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) });
  }
  if (error || !data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-6 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Berita tidak ditemukan" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "mt-4 inline-flex items-center gap-2 text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Kembali ke News"
      ] })
    ] });
  }
  const date = new Date(data.news_date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "pb-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-4xl px-6 pt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      " Kembali ke News"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "mx-auto mt-6 max-w-4xl px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-medium text-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: date })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl", children: data.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-lg text-muted-foreground", children: data.description })
      ] }),
      images.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-10 overflow-hidden rounded-2xl shadow-[var(--shadow-card)] group bg-muted aspect-[16/9]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: images[currentImageIndex], alt: `${data.title} - ${currentImageIndex + 1}`, className: "w-full h-full object-cover transition-all duration-500" }),
        images.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: prevImage, className: "absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5 text-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: nextImage, className: "absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-5 h-5 text-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2", children: images.map((_, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCurrentImageIndex(idx), className: `w-2 h-2 rounded-full transition-all ${currentImageIndex === idx ? "bg-primary w-4" : "bg-white/60"}` }, idx)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prose prose-lg mx-auto mt-10 max-w-none whitespace-pre-wrap text-base leading-relaxed text-foreground/90", children: data.content })
    ] }),
    related && related.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto mt-20 max-w-7xl px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold tracking-tight", children: "Berita Lainnya" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3", children: related.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(NewsCard, { ...n }, n.id)) })
    ] })
  ] });
}
export {
  NewsDetailPage as component
};
