import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (p: string) => pathname === p;

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    // Cek status tema saat ini
    const isDarkMode = root.classList.contains("dark");
    setIsDark(isDarkMode);

    // Rahasia estetik: Suntik class transisi ke seluruh body biar pas ganti tema warnanya 'fading' halus
    root.classList.add("transition-colors", "duration-500", "ease-in-out");
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-[#493725] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* KIRI: Logo & Nama */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 overflow-hidden items-center justify-center rounded-lg bg-white p-1 shadow-md transition-transform duration-300 group-hover:scale-105">
            {/* Logo sudah diset ke /logo.png sesuai yang lu simpan di folder public */}
            <img 
              src="/logo.png" 
              alt="Logo Jakarta Mengabdi" 
              className="h-full w-full object-contain" 
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-tight text-white transition-opacity group-hover:opacity-90">
              Jakarta Mengabdi
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white/70">
              Berita & Kegiatan
            </span>
          </div>
        </Link>

        {/* KANAN: Navigasi & Tema */}
        <div className="flex items-center gap-5">
          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-md hover:text-white ${
                isActive("/") ? "text-white" : "text-white/70"
              }`}
            >
              News
              {isActive("/") && (
                <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-white transition-all" />
              )}
            </Link>
            
            {/* Link ke Web Utama Jakarta Mengabdi */}
            <a
              href="https://www.jakartamengabdi.com/" 
              target="_blank"
              rel="noopener noreferrer"
              className="relative px-3 py-2 text-sm font-medium transition-colors rounded-md text-white/70 hover:text-white"
            >
              Jakarta Mengabdi
            </a>
          </nav>

          {/* Garis Pemisah */}
          <div className="h-5 w-px bg-white/20 rounded-full"></div>

          {/* Tombol Toggle Tema (Dengan Animasi Ikon) */}
          <button
            onClick={toggleTheme}
            className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/10 text-white shadow-inner transition-all duration-300 hover:bg-white/20 hover:scale-110 focus:outline-none"
            title={isDark ? "Ubah ke Terang" : "Ubah ke Gelap"}
          >
            {/* Animasi Ikon Matahari */}
            <div
              className={`absolute transition-all duration-500 ease-in-out transform ${
                isDark ? "translate-y-0 rotate-0 opacity-100" : "translate-y-8 rotate-90 opacity-0"
              }`}
            >
              <Sun className="h-4 w-4" />
            </div>

            {/* Animasi Ikon Bulan */}
            <div
              className={`absolute transition-all duration-500 ease-in-out transform ${
                isDark ? "-translate-y-8 -rotate-90 opacity-0" : "translate-y-0 rotate-0 opacity-100"
              }`}
            >
              <Moon className="h-4 w-4" />
            </div>
          </button>
        </div>
        
      </div>
    </header>
  );
}