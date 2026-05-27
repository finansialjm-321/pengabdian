import { S as reactExports, J as jsxRuntimeExports } from "./server-DqbPya7C.mjs";
import { u as useQuery } from "./useQuery-DUQ1Z3FV.mjs";
import { q as useQueryClient, o as toast, c as createLucideIcon } from "./router-stYq-Lqq.mjs";
import { L as LoaderCircle, s as supabase } from "./client-aaA1sfNs.mjs";
import { A as AdminLayout } from "./AdminLayout-BvAayTFP.mjs";
import { B as Button, L as Label, I as Input, c as cn } from "./label-i0fTrUML.mjs";
import { l as Plus, P as Pencil, T as Trash2, D as Dialog, h as DialogContent, j as DialogHeader, k as DialogTitle, X, i as DialogFooter, A as AlertDialog, c as AlertDialogContent, f as AlertDialogHeader, g as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, b as AlertDialogCancel, a as AlertDialogAction } from "./alert-dialog-CClTc4TC.mjs";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./useAuth-DnuUE_hg.mjs";
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
const Textarea = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
const emptyForm = {
  title: "",
  description: "",
  content: "",
  image_gallery: [],
  news_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
};
function ManageNews() {
  const qc = useQueryClient();
  const [open, setOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(emptyForm);
  const [saving, setSaving] = reactExports.useState(false);
  const [uploading, setUploading] = reactExports.useState(false);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin-news"],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("news").select("*").order("news_date", {
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
  const openEdit = (n) => {
    setEditing(n);
    const existingImages = n.image_gallery && n.image_gallery.length > 0 ? n.image_gallery : n.image_url ? [n.image_url] : [];
    setForm({
      title: n.title,
      description: n.description,
      content: n.content,
      image_gallery: existingImages,
      news_date: n.news_date
    });
    setOpen(true);
  };
  const handleUpload = async (files) => {
    setUploading(true);
    const uploadedUrls = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const {
        error
      } = await supabase.storage.from("news-images").upload(path, file);
      if (error) {
        toast.error(`Gagal unggah ${file.name}: ${error.message}`);
        continue;
      }
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from("news-images").getPublicUrl(path);
      uploadedUrls.push(publicUrl);
    }
    setForm((f) => ({
      ...f,
      image_gallery: [...f.image_gallery, ...uploadedUrls]
    }));
    setUploading(false);
    if (uploadedUrls.length > 0) {
      toast.success(`${uploadedUrls.length} gambar berhasil diunggah`);
    }
  };
  const removeImage = (indexToRemove) => {
    setForm((f) => ({
      ...f,
      image_gallery: f.image_gallery.filter((_, index) => index !== indexToRemove)
    }));
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const coverImage = form.image_gallery.length > 0 ? form.image_gallery[0] : null;
    const payload = {
      title: form.title,
      description: form.description,
      content: form.content,
      image_url: coverImage,
      image_gallery: form.image_gallery,
      news_date: form.news_date
    };
    const {
      error
    } = editing ? await supabase.from("news").update(payload).eq("id", editing.id) : await supabase.from("news").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editing ? "Berita diperbarui" : "Berita ditambahkan");
    setOpen(false);
    qc.invalidateQueries({
      queryKey: ["admin-news"]
    });
    qc.invalidateQueries({
      queryKey: ["news"]
    });
    qc.invalidateQueries({
      queryKey: ["news-count"]
    });
    qc.invalidateQueries({
      queryKey: ["news-latest"]
    });
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    const {
      error
    } = await supabase.from("news").delete().eq("id", deleteId);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Berita dihapus");
    setDeleteId(null);
    qc.invalidateQueries({
      queryKey: ["admin-news"]
    });
    qc.invalidateQueries({
      queryKey: ["news"]
    });
    qc.invalidateQueries({
      queryKey: ["news-count"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Manage News", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Kelola semua berita & kegiatan komunitas." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: openCreate, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
        " Tambah Berita"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "border-b border-border bg-muted/50 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold", children: "Cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold", children: "Judul" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold", children: "Tanggal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-semibold", children: "Aksi" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border", children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "py-10 text-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "inline h-5 w-5 animate-spin" }) }) }),
        data && data.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "py-10 text-center text-muted-foreground", children: "Belum ada berita." }) }),
        data?.map((n) => {
          const coverImg = n.image_gallery && n.image_gallery.length > 0 ? n.image_gallery[0] : n.image_url;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "transition-colors hover:bg-muted/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-16 overflow-hidden rounded-md bg-muted", children: coverImg && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: coverImg, alt: n.title, className: "h-full w-full object-cover" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium line-clamp-1", children: n.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground line-clamp-1", children: n.description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: new Date(n.news_date).toLocaleDateString("id-ID") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => openEdit(n), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "text-destructive hover:text-destructive", onClick: () => setDeleteId(n.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
            ] }) })
          ] }, n.id);
        })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit Berita" : "Tambah Berita" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "title", children: "Judul" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "title", required: true, value: form.title, onChange: (e) => setForm({
            ...form,
            title: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "news_date", children: "Tanggal Kegiatan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "news_date", type: "date", required: true, value: form.news_date, onChange: (e) => setForm({
            ...form,
            news_date: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Unggah Dokumentasi (Bisa pilih lebih dari satu)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-muted-foreground mb-2", children: "*Rekomendasi ukuran: Rasio 16:9 (minimal 848 x 477 pixel) agar gambar proporsional dan tidak terpotong." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 px-4 py-6 text-sm text-muted-foreground hover:bg-muted transition-colors", children: [
            uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: uploading ? "Mengunggah gambar..." : "Klik untuk pilih file gambar" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", multiple: true, className: "hidden", onChange: (e) => e.target.files && e.target.files.length > 0 && handleUpload(e.target.files), disabled: uploading })
          ] }),
          form.image_gallery.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3", children: form.image_gallery.map((url, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group rounded-md overflow-hidden aspect-square border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, alt: `Preview ${index}`, className: "w-full h-full object-cover" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeImage(index), className: "bg-destructive text-white p-1.5 rounded-full hover:scale-110 transition-transform", title: "Hapus gambar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) }) }),
            index === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded shadow", children: "Cover" })
          ] }, index)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", children: "Deskripsi Singkat" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "description", required: true, rows: 2, value: form.description, onChange: (e) => setForm({
            ...form,
            description: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "content", children: "Konten Detail" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "content", required: true, rows: 8, value: form.content, onChange: (e) => setForm({
            ...form,
            content: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setOpen(false), children: "Batal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: saving || uploading, children: [
            saving && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
            "Simpan"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleteId, onOpenChange: (o) => !o && setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Hapus berita?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Tindakan ini tidak dapat dibatalkan. Berita akan dihapus secara permanen." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Batal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: handleDelete, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Hapus" })
      ] })
    ] }) })
  ] });
}
export {
  ManageNews as component
};
