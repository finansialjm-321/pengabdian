import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-[#493725]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          
          {/* KIRI: Brand & Tagline */}
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <div className="flex items-center gap-2.5">
              {/* Logo Jakarta Mengabdi */}
              <div className="flex h-8 w-8 items-center justify-center rounded bg-white p-0.5 shadow-sm">
                <img 
                  src="/logo.png" 
                  alt="Logo Jakarta Mengabdi" 
                  className="h-full w-full object-contain" 
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Jakarta Mengabdi
              </span>
            </div>
            
            <p className="flex items-center gap-1.5 text-sm text-white/70">
              Membangun komunitas, membagi cerita 
              <Heart className="h-4 w-4 fill-red-500 text-red-500 animate-pulse" />
            </p>
          </div>

          {/* KANAN: Links & Copyright */}
          <div className="flex flex-col items-center gap-5 sm:items-end">
            <Link
              to="/admin/login"
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-medium text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              Admin Panel
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            
            <span className="text-xs tracking-wider text-white/40">
              © {new Date().getFullYear()} JAKARTA MENGABDI. ALL RIGHTS RESERVED.
            </span>
          </div>
          
        </div>
      </div>
    </footer>
  );
}