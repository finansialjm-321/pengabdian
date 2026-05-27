import { S as reactExports, J as jsxRuntimeExports } from "./server-DqbPya7C.mjs";
import { u as useQuery } from "./useQuery-DUQ1Z3FV.mjs";
import { q as useQueryClient, o as toast } from "./router-stYq-Lqq.mjs";
import { L as LoaderCircle, s as supabase } from "./client-aaA1sfNs.mjs";
import { A as AdminLayout } from "./AdminLayout-BvAayTFP.mjs";
import { B as Button, L as Label, I as Input } from "./label-i0fTrUML.mjs";
import { l as Plus, P as Pencil, T as Trash2, D as Dialog, h as DialogContent, j as DialogHeader, k as DialogTitle, i as DialogFooter, A as AlertDialog, c as AlertDialogContent, f as AlertDialogHeader, g as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, b as AlertDialogCancel, a as AlertDialogAction } from "./alert-dialog-CClTc4TC.mjs";
import { M as MapPin } from "./map-pin-DOloeFp8.mjs";
import { C as Calendar } from "./calendar-D2JeG6P7.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./useAuth-DnuUE_hg.mjs";
const emptyForm = {
  event_name: "",
  location: "",
  event_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
};
function ManageJourneys() {
  const qc = useQueryClient();
  const [open, setOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(emptyForm);
  const [saving, setSaving] = reactExports.useState(false);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin-journeys"],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("journeys").select("*").order("event_date", {
        ascending: false
      });
      if (error) throw error;
      return data2;
    }
  });
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };
  const openEdit = (j) => {
    setEditing(j);
    setForm({
      event_name: j.event_name,
      location: j.location,
      event_date: j.event_date
    });
    setOpen(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      event_name: form.event_name,
      location: form.location,
      event_date: form.event_date
    };
    const {
      error
    } = editing ? await supabase.from("journeys").update(payload).eq("id", editing.id) : await supabase.from("journeys").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editing ? "Perjalanan diperbarui" : "Perjalanan ditambahkan");
    setOpen(false);
    qc.invalidateQueries({
      queryKey: ["admin-journeys"]
    });
    qc.invalidateQueries({
      queryKey: ["journeys"]
    });
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    const {
      error
    } = await supabase.from("journeys").delete().eq("id", deleteId);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Perjalanan dihapus");
    setDeleteId(null);
    qc.invalidateQueries({
      queryKey: ["admin-journeys"]
    });
    qc.invalidateQueries({
      queryKey: ["journeys"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Manage Journeys", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Kelola rekam jejak perjalanan komunitas." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: openCreate, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
        " Tambah Perjalanan"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "border-b border-border bg-muted/50 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold", children: "Nama Kegiatan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold", children: "Lokasi" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold", children: "Tanggal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-semibold", children: "Aksi" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "py-10 text-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "inline h-5 w-5 animate-spin" }) }) }),
        data && data.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "py-10 text-center text-muted-foreground", children: "Belum ada rekam jejak perjalanan." }) }),
        data?.map((j) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "transition-colors hover:bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: j.event_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5" }),
            j.location
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" }),
            new Date(j.event_date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => openEdit(j), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "text-destructive hover:text-destructive", onClick: () => setDeleteId(j.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
          ] }) })
        ] }, j.id))
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit Perjalanan" : "Tambah Perjalanan" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "space-y-4 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "event_name", children: "Nama Kegiatan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "event_name", placeholder: "Contoh: Baksos Kemerdekaan", required: true, value: form.event_name, onChange: (e) => setForm({
            ...form,
            event_name: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "location", children: "Lokasi Kegiatan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "location", placeholder: "Contoh: RPTRA Kalijodo, Jakarta", required: true, value: form.location, onChange: (e) => setForm({
            ...form,
            location: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "event_date", children: "Tanggal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "event_date", type: "date", required: true, value: form.event_date, onChange: (e) => setForm({
            ...form,
            event_date: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setOpen(false), children: "Batal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: saving, children: [
            saving && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
            "Simpan"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleteId, onOpenChange: (o) => !o && setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Hapus Perjalanan?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Data rekam jejak ini akan dihapus secara permanen dari sistem dan timeline web." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Batal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: handleDelete, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Hapus" })
      ] })
    ] }) })
  ] });
}
export {
  ManageJourneys as component
};
