import { c as createLucideIcon, L as Link } from "./router-stYq-Lqq.mjs";
import { J as jsxRuntimeExports } from "./server-DqbPya7C.mjs";
import { C as Calendar } from "./calendar-D2JeG6P7.mjs";
const __iconNode$2 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$2);
const __iconNode$1 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$1);
const __iconNode = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode);
function NewsCard({ id, title, description, image_url, news_date }) {
  const date = new Date(news_date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/news/$id",
      params: { id },
      className: "group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative aspect-[16/10] overflow-hidden bg-muted", children: image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: image_url,
            alt: title,
            className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
            loading: "lazy"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full bg-[var(--gradient-warm)] opacity-30" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: date })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 line-clamp-2 text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground", children: description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary", children: [
            "Baca Selengkapnya",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5 transition-transform group-hover:translate-x-1" })
          ] })
        ] })
      ]
    }
  );
}
export {
  ChevronLeft as C,
  NewsCard as N,
  ChevronRight as a
};
