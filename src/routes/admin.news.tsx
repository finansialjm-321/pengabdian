import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/news")({
  component: ManageNews,
});

type NewsRow = {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string | null;
  image_gallery: string[] | null;
  news_date: string;
};

const emptyForm = { 
  title: "", 
  description: "", 
  content: "", 
  image_gallery: [] as string[], 
  news_date: new Date().toISOString().slice(0, 10) 
};

function ManageNews() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NewsRow | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-news"],
    queryFn: async () => {
      const { data, error } = await supabase.from("news").select("*").order("news_date", { ascending: false });
      if (error) throw error;
      return data as any as NewsRow[];
    },
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (n: NewsRow) => {
    setEditing(n);
    const existingImages = n.image_gallery && n.image_gallery.length > 0 
      ? n.image_gallery 
      : (n.image_url ? [n.image_url] : []);
      
    setForm({
      title: n.title,
      description: n.description,
      content: n.content,
      image_gallery: existingImages,
      news_date: n.news_date,
    });
    setOpen(true);
  };

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      
      const { error } = await supabase.storage.from("news-images").upload(path, file);
      if (error) {
        toast.error(`Gagal unggah ${file.name}: ${error.message}`);
        continue;
      }
      
      const { data: { publicUrl } } = supabase.storage.from("news-images").getPublicUrl(path);
      uploadedUrls.push(publicUrl);
    }

    setForm((f) => ({ ...f, image_gallery: [...f.image_gallery, ...uploadedUrls] }));
    setUploading(false);
    
    if (uploadedUrls.length > 0) {
      toast.success(`${uploadedUrls.length} gambar berhasil diunggah`);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setForm((f) => ({
      ...f,
      image_gallery: f.image_gallery.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const coverImage = form.image_gallery.length > 0 ? form.image_gallery[0] : null;

    const payload = {
      title: form.title,
      description: form.description,
      content: form.content,
      image_url: coverImage, 
      image_gallery: form.image_gallery,
      news_date: form.news_date,
    };
    
    // Trik "as any" dimasukin di sini biar TS nggak rewel soal payload
    const { error } = editing
      ? await supabase.from("news").update(payload as any).eq("id", editing.id)
      : await supabase.from("news").insert(payload as any);
      
    setSaving(false);
    
    if (error) {
      toast.error(error.message);
      return;
    }
    
    toast.success(editing ? "Berita diperbarui" : "Berita ditambahkan");
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["admin-news"] });
    qc.invalidateQueries({ queryKey: ["news"] });
    qc.invalidateQueries({ queryKey: ["news-count"] });
    qc.invalidateQueries({ queryKey: ["news-latest"] });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("news").delete().eq("id", deleteId);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Berita dihapus");
    setDeleteId(null);
    qc.invalidateQueries({ queryKey: ["admin-news"] });
    qc.invalidateQueries({ queryKey: ["news"] });
    qc.invalidateQueries({ queryKey: ["news-count"] });
  };

  return (
    <AdminLayout title="Manage News">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Kelola semua berita & kegiatan komunitas.</p>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Berita
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Cover</th>
              <th className="px-4 py-3 font-semibold">Judul</th>
              <th className="px-4 py-3 font-semibold">Tanggal</th>
              <th className="px-4 py-3 text-right font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr><td colSpan={4} className="py-10 text-center text-muted-foreground"><Loader2 className="inline h-5 w-5 animate-spin" /></td></tr>
            )}
            {data && data.length === 0 && (
              <tr><td colSpan={4} className="py-10 text-center text-muted-foreground">Belum ada berita.</td></tr>
            )}
            {data?.map((n) => {
              const coverImg = (n.image_gallery && n.image_gallery.length > 0) ? n.image_gallery[0] : n.image_url;
              return (
                <tr key={n.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="h-12 w-16 overflow-hidden rounded-md bg-muted">
                      {coverImg && <img src={coverImg} alt={n.title} className="h-full w-full object-cover" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium line-clamp-1">{n.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{n.description}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(n.news_date).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(n)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(n.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Berita" : "Tambah Berita"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="news_date">Tanggal Kegiatan</Label>
              <Input id="news_date" type="date" required value={form.news_date} onChange={(e) => setForm({ ...form, news_date: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Unggah Dokumentasi (Bisa pilih lebih dari satu)</Label>
              <p className="text-[13px] text-muted-foreground mb-2">
                *Rekomendasi ukuran: Rasio 16:9 (minimal 848 x 477 pixel) agar gambar proporsional dan tidak terpotong.
              </p>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 px-4 py-6 text-sm text-muted-foreground hover:bg-muted transition-colors">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                <span>{uploading ? "Mengunggah gambar..." : "Klik untuk pilih file gambar"}</span>
                <input
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="hidden"
                  onChange={(e) => e.target.files && e.target.files.length > 0 && handleUpload(e.target.files)}
                  disabled={uploading}
                />
              </label>
              
              {form.image_gallery.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {form.image_gallery.map((url, index) => (
                    <div key={index} className="relative group rounded-md overflow-hidden aspect-square border border-border">
                      <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-destructive text-white p-1.5 rounded-full hover:scale-110 transition-transform"
                          title="Hapus gambar"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {index === 0 && (
                        <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Singkat</Label>
              <Textarea id="description" required rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Konten Detail</Label>
              <Textarea id="content" required rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
              <Button type="submit" disabled={saving || uploading}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus berita?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Berita akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}