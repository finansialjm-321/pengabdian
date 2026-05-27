import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/journeys")({
  component: ManageJourneys,
});

type JourneyRow = {
  id: string;
  event_name: string;
  location: string;
  event_date: string;
};

const emptyForm = { 
  event_name: "", 
  location: "", 
  event_date: new Date().toISOString().slice(0, 10) 
};

function ManageJourneys() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<JourneyRow | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-journeys"],
    queryFn: async () => {
      // Pake "as any" biar TS nggak rewel
      const { data, error } = await supabase
        .from("journeys" as any)
        .select("*")
        .order("event_date", { ascending: false });
      if (error) throw error;
      return data as any as JourneyRow[];
    },
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (j: JourneyRow) => {
    setEditing(j);
    setForm({
      event_name: j.event_name,
      location: j.location,
      event_date: j.event_date,
    });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = {
      event_name: form.event_name,
      location: form.location,
      event_date: form.event_date,
    };
    
    const { error } = editing
      ? await supabase.from("journeys" as any).update(payload).eq("id", editing.id)
      : await supabase.from("journeys" as any).insert(payload);
      
    setSaving(false);
    
    if (error) {
      toast.error(error.message);
      return;
    }
    
    toast.success(editing ? "Perjalanan diperbarui" : "Perjalanan ditambahkan");
    setOpen(false);
    // Refresh data di admin dan di halaman depan
    qc.invalidateQueries({ queryKey: ["admin-journeys"] });
    qc.invalidateQueries({ queryKey: ["journeys"] }); 
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("journeys" as any).delete().eq("id", deleteId);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Perjalanan dihapus");
    setDeleteId(null);
    qc.invalidateQueries({ queryKey: ["admin-journeys"] });
    qc.invalidateQueries({ queryKey: ["journeys"] });
  };

  return (
    <AdminLayout title="Manage Journeys">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Kelola rekam jejak perjalanan komunitas.</p>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Perjalanan
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Nama Kegiatan</th>
              <th className="px-4 py-3 font-semibold">Lokasi</th>
              <th className="px-4 py-3 font-semibold">Tanggal</th>
              <th className="px-4 py-3 text-right font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr><td colSpan={4} className="py-10 text-center text-muted-foreground"><Loader2 className="inline h-5 w-5 animate-spin" /></td></tr>
            )}
            {data && data.length === 0 && (
              <tr><td colSpan={4} className="py-10 text-center text-muted-foreground">Belum ada rekam jejak perjalanan.</td></tr>
            )}
            {data?.map((j) => (
              <tr key={j.id} className="transition-colors hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">
                  {j.event_name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {j.location}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(j.event_date).toLocaleDateString("id-ID", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(j)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(j.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Perjalanan" : "Tambah Perjalanan"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="event_name">Nama Kegiatan</Label>
              <Input 
                id="event_name" 
                placeholder="Contoh: Baksos Kemerdekaan"
                required 
                value={form.event_name} 
                onChange={(e) => setForm({ ...form, event_name: e.target.value })} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Lokasi Kegiatan</Label>
              <Input 
                id="location" 
                placeholder="Contoh: RPTRA Kalijodo, Jakarta"
                required 
                value={form.location} 
                onChange={(e) => setForm({ ...form, location: e.target.value })} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_date">Tanggal</Label>
              <Input 
                id="event_date" 
                type="date" 
                required 
                value={form.event_date} 
                onChange={(e) => setForm({ ...form, event_date: e.target.value })} 
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
              <Button type="submit" disabled={saving}>
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
            <AlertDialogTitle>Hapus Perjalanan?</AlertDialogTitle>
            <AlertDialogDescription>
              Data rekam jejak ini akan dihapus secara permanen dari sistem dan timeline web.
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