import { S as reactExports, J as jsxRuntimeExports } from "./server-DqbPya7C.mjs";
import { u as useNavigate, L as Link, o as toast } from "./router-stYq-Lqq.mjs";
import { L as LoaderCircle, s as supabase } from "./client-aaA1sfNs.mjs";
import { u as useAuth, N as Newspaper } from "./useAuth-DnuUE_hg.mjs";
import { L as Label, I as Input, B as Button } from "./label-i0fTrUML.mjs";
import { A as ArrowLeft } from "./arrow-left-GGB1ZSUJ.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function AdminLogin() {
  const navigate = useNavigate();
  const {
    user,
    loading
  } = useAuth();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!loading && user) navigate({
      to: "/admin/dashboard"
    });
  }, [user, loading, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const {
      error
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Login berhasil");
    navigate({
      to: "/admin/dashboard"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex min-h-screen items-center justify-center bg-muted/30 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      " Kembali ke News"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-col items-center gap-3 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--gradient-warm)] text-primary-foreground shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Newspaper, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Admin Login" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Masuk untuk mengelola berita" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", className: "w-full", disabled: submitting, children: [
          submitting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
          "Masuk"
        ] })
      ] })
    ] })
  ] }) });
}
export {
  AdminLogin as component
};
