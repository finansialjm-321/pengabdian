import { Link } from "@tanstack/react-router";
import { Calendar, ArrowRight } from "lucide-react";

interface NewsCardProps {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  news_date: string;
}

export function NewsCard({ id, title, description, image_url, news_date }: NewsCardProps) {
  const date = new Date(news_date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Link
      to="/news/$id"
      params={{ id }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {image_url ? (
          <img
            src={image_url}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-[var(--gradient-warm)] opacity-30" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{date}</span>
        </div>
        <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">{description}</p>
        <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          Baca Selengkapnya
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
