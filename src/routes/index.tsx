import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NewsCard } from "@/components/NewsCard";
import { Loader2, ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";

interface Journey {
  id: string;
  event_name: string;
  location: string;
  event_date: string;
}

interface NewsItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  news_date: string;
}

export const Route = createFileRoute("/")({
  component: NewsPage,
});

const BANNER_IMAGES = [
  "/banner1.jpeg",
  "/banner2.jpeg",
  "/banner3.jpeg",
];

function NewsPage() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev === BANNER_IMAGES.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextBanner = () => setCurrentBanner((prev) => (prev === BANNER_IMAGES.length - 1 ? 0 : prev + 1));
  const prevBanner = () => setCurrentBanner((prev) => (prev === 0 ? BANNER_IMAGES.length - 1 : prev - 1));

  const { data: newsData, isLoading: newsLoading, error: newsError } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("id, title, description, image_url, news_date")
        .order("news_date", { ascending: false });
      if (error) throw error;
      // Pakai as any as NewsItem[] buat maksa TypeScript nerima perubahan tipe
      return data as any as NewsItem[]; 
    },
  });

  const { data: journeysData, isLoading: journeysLoading } = useQuery({
    queryKey: ["journeys"],
    queryFn: async () => {
      // Pakai as any di nama table biar TS nggak protes table belum terdaftar
      const { data, error } = await supabase
        .from("journeys" as any)
        .select("*")
        .order("event_date", { ascending: false });
      if (error) throw error;
      return data as any as Journey[];
    },
  });

  return (
    <main className="pb-16">
      {/* HEADER SECTION */}
      <section className="mx-auto max-w-4xl px-6 py-12 text-center sm:py-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-medium text-primary mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Berita & Perjalanan Komunitas
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Jejak Langkah{" "}
          <span className="bg-(--gradient-warm) bg-clip-text">
            Jakarta Mengabdi
          </span>
        </h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          Ikuti perjalanan, kegiatan sosial, dan dampak yang kami ciptakan bersama komunitas.
        </p>
      </section>

      {/* BANNER CAROUSEL */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mb-20">
        {/* Di sini perubahannya: h-[500px] untuk HP, md:h-[960px] untuk Desktop */}
        <div className="relative group overflow-hidden rounded-3xl shadow-lg w-full h-125 md:h-240 bg-muted">
          <img 
            src={BANNER_IMAGES[currentBanner]} 
            alt="Banner Jakarta Mengabdi" 
            className="w-full h-full object-cover transition-all duration-500 ease-in-out"
          />
          <button onClick={prevBanner} className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button onClick={nextBanner} className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {BANNER_IMAGES.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentBanner(idx)} className={`w-2.5 h-2.5 rounded-full transition-all ${currentBanner === idx ? "bg-primary w-6" : "bg-white/60 hover:bg-white"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE SECTION */}
      <section className="mx-auto max-w-5xl px-6 mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Perjalanan Kami</h2>
        {journeysLoading ? (
           <div className="flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
        ) : journeysData && journeysData.length > 0 ? (
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2"></div>
            <div className="space-y-12">
              {journeysData.map((journey, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={journey.id} className={`relative flex flex-col md:flex-row items-start md:items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary ring-4 ring-background transform -translate-x-1/2 mt-1.5 md:mt-0 z-10"></div>
                    <div className={`ml-12 md:ml-0 md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12'} text-left ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                      <div className="p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className={`flex items-center gap-2 text-sm text-primary font-medium mb-2 ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(journey.event_date).getFullYear()}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{journey.event_name}</h3>
                        <div className={`flex items-center gap-1.5 text-muted-foreground text-sm ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
                          <MapPin className="w-4 h-4" />
                          <span>{journey.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Belum ada rekam jejak perjalanan.</p>
        )}
      </section>

      {/* BERITA SECTION */}
      <section className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Cerita & Kegiatan</h2>
        {newsLoading && (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        {newsError && (
          <p className="text-center text-sm text-destructive">Gagal memuat berita.</p>
        )}
        {newsData && newsData.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 py-20 text-center">
            <p className="text-sm text-muted-foreground">Belum ada berita yang dipublikasikan.</p>
          </div>
        )}
        {newsData && newsData.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {newsData.map((n) => (
              <NewsCard key={n.id} {...n} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}