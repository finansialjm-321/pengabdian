import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { NewsCard } from "@/components/NewsCard";

interface NewsDetail {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string;
  image_gallery: string[] | null;
  news_date: string;
}

interface RelatedNewsItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  news_date: string;
}

export const Route = createFileRoute("/news/$id")({
  component: NewsDetailPage,
});

function NewsDetailPage() {
  const { id } = Route.useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["news", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("news").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      // Memaksa TS buat nerima struktur baru yang ada image_gallery-nya
      return data as any as NewsDetail; 
    },
  });

  const { data: related } = useQuery({
    queryKey: ["news-related", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("id, title, description, image_url, news_date")
        .neq("id", id)
        .order("news_date", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data as any as RelatedNewsItem[];
    },
  });

  const images = (data?.image_gallery && data.image_gallery.length > 0)
    ? data.image_gallery
    : (data?.image_url ? [data.image_url] : []);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  const nextImage = () => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">Berita tidak ditemukan</h1>
        <Link to="/" className="mt-4 inline-flex items-center gap-2 text-primary">
          <ArrowLeft className="h-4 w-4" /> Kembali ke News
        </Link>
      </div>
    );
  }

  const date = new Date(data.news_date).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <main className="pb-16">
      <div className="mx-auto max-w-4xl px-6 pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke News
        </Link>
      </div>

      <article className="mx-auto mt-6 max-w-4xl px-6">
        <header>
          <div className="flex items-center gap-2 text-xs font-medium text-primary">
            <Calendar className="h-3.5 w-3.5" />
            <span>{date}</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {data.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{data.description}</p>
        </header>

        {images.length > 0 && (
          <div className="relative mt-10 overflow-hidden rounded-2xl shadow-[var(--shadow-card)] group bg-muted aspect-[16/9]">
            <img 
              src={images[currentImageIndex]} 
              alt={`${data.title} - ${currentImageIndex + 1}`} 
              className="w-full h-full object-cover transition-all duration-500" 
            />
            
            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === idx ? "bg-primary w-4" : "bg-white/60"}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="prose prose-lg mx-auto mt-10 max-w-none whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
          {data.content}
        </div>
      </article>

      {related && related.length > 0 && (
        <section className="mx-auto mt-20 max-w-7xl px-6">
          <h2 className="text-2xl font-bold tracking-tight">Berita Lainnya</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((n) => (
              <NewsCard key={n.id} {...n} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}