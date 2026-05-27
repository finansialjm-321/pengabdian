import { S as reactExports, J as jsxRuntimeExports } from "./server-DqbPya7C.mjs";
import { u as useQuery } from "./useQuery-DUQ1Z3FV.mjs";
import { L as LoaderCircle, s as supabase } from "./client-aaA1sfNs.mjs";
import { C as ChevronLeft, a as ChevronRight, N as NewsCard } from "./NewsCard-CB6BS67N.mjs";
import { C as Calendar } from "./calendar-D2JeG6P7.mjs";
import { M as MapPin } from "./map-pin-DOloeFp8.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-stYq-Lqq.mjs";
const BANNER_IMAGES = ["/banner1.jpeg", "/banner2.jpeg", "/banner3.jpeg"];
function NewsPage() {
  const [currentBanner, setCurrentBanner] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => prev === BANNER_IMAGES.length - 1 ? 0 : prev + 1);
    }, 5e3);
    return () => clearInterval(timer);
  }, []);
  const nextBanner = () => setCurrentBanner((prev) => prev === BANNER_IMAGES.length - 1 ? 0 : prev + 1);
  const prevBanner = () => setCurrentBanner((prev) => prev === 0 ? BANNER_IMAGES.length - 1 : prev - 1);
  const {
    data: newsData,
    isLoading: newsLoading,
    error: newsError
  } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("news").select("id, title, description, image_url, news_date").order("news_date", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const {
    data: journeysData,
    isLoading: journeysLoading
  } = useQuery({
    queryKey: ["journeys"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("journeys").select("*").order("event_date", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "pb-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-4xl px-6 py-12 text-center sm:py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-medium text-primary mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary" }),
        "Berita & Perjalanan Komunitas"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-extrabold tracking-tight sm:text-5xl", children: [
        "Jejak Langkah",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-(--gradient-warm) bg-clip-text", children: "Jakarta Mengabdi" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-base text-muted-foreground sm:text-lg", children: "Ikuti perjalanan, kegiatan sosial, dan dampak yang kami ciptakan bersama komunitas." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-6xl px-4 sm:px-6 mb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group overflow-hidden rounded-3xl shadow-lg w-full h-125 md:h-240 bg-muted", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: BANNER_IMAGES[currentBanner], alt: "Banner Jakarta Mengabdi", className: "w-full h-full object-cover transition-all duration-500 ease-in-out" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: prevBanner, className: "absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5 text-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: nextBanner, className: "absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-5 h-5 text-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2", children: BANNER_IMAGES.map((_, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCurrentBanner(idx), className: `w-2.5 h-2.5 rounded-full transition-all ${currentBanner === idx ? "bg-primary w-6" : "bg-white/60 hover:bg-white"}` }, idx)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-5xl px-6 mb-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold text-center mb-12", children: "Perjalanan Kami" }),
      journeysLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin text-primary" }) }) : journeysData && journeysData.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-12", children: journeysData.map((journey, index) => {
          const isEven = index % 2 === 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative flex flex-col md:flex-row items-start md:items-center ${isEven ? "md:flex-row-reverse" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary ring-4 ring-background transform -translate-x-1/2 mt-1.5 md:mt-0 z-10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `ml-12 md:ml-0 md:w-1/2 ${isEven ? "md:pl-12" : "md:pr-12"} text-left ${isEven ? "md:text-left" : "md:text-right"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-shadow", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-2 text-sm text-primary font-medium mb-2 ${isEven ? "md:justify-start" : "md:justify-end"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(journey.event_date).getFullYear() })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-2", children: journey.event_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-1.5 text-muted-foreground text-sm ${isEven ? "md:justify-start" : "md:justify-end"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: journey.location })
              ] })
            ] }) })
          ] }, journey.id);
        }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-muted-foreground", children: "Belum ada rekam jejak perjalanan." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold text-center mb-10", children: "Cerita & Kegiatan" }),
      newsLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-10 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin" }) }),
      newsError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-sm text-destructive", children: "Gagal memuat berita." }),
      newsData && newsData.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-dashed border-border bg-muted/30 py-20 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Belum ada berita yang dipublikasikan." }) }),
      newsData && newsData.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3", children: newsData.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(NewsCard, { ...n }, n.id)) })
    ] })
  ] });
}
export {
  NewsPage as component
};
