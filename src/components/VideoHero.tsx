'use client';

import React, { useState, useEffect } from 'react';
import { Youtube, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Manhwa } from '@/types/manhwa';

interface VideoHeroProps {
  manhwas: Manhwa[];
  onExploreClick?: () => void;
}

// Lista oficial de recaps em alta resolução do canal Luke Manhwa (@lukezinhorecap)
const DEFAULT_LUKE_VIDEOS = [
  'G-bGQ7jQIqs', // 😳 a WAIFU dele é uma ALIEN FOFA!? | Manhwa Recap
  'CgyXHx6h2a8', // 🥵 REENCARNOU como VILÃO!?! E tem uma ESPOSA MAID FOFA!! 😳 | Manhwa Recap 4
  'v5WpaF8Ru38', // ELE é FORÇADO a se CASAR com uma ANJA!! 😳 | Manhwa Recap 2
  'O5Fd_aYgPBM', // 🥵 ELE tem uma ESPOSA ANJO MALUCA!?! 😳 | Manhwa Recap
  'JmSLxOZu0KU', // 🥵 REENCARNOU como VILÃO!?! E agora é uma GAROTA FOFA?!! 😳 | Manhwa Recap 3
];

export default function VideoHero({ manhwas, onExploreClick }: VideoHeroProps) {
  // Pega os vídeos vinculados às obras cadastradas ou usa os recaps oficiais do canal
  const videoIds = React.useMemo(() => {
    const list: string[] = [];
    manhwas.forEach((m) => {
      if (m.lukeVideoUrl) {
        const match = m.lukeVideoUrl.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
        if (match && match[1] && !list.includes(match[1])) {
          list.push(match[1]);
        }
      }
    });

    // Se tiver menos de 5 vídeos, completa com os vídeos padrão do Luke
    DEFAULT_LUKE_VIDEOS.forEach((id) => {
      if (!list.includes(id)) {
        list.push(id);
      }
    });

    return list;
  }, [manhwas]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentVideoId = videoIds[currentIndex] || DEFAULT_LUKE_VIDEOS[0];

  // Alterna automaticamente as thumbnails a cada 7 segundos com transição suave
  useEffect(() => {
    if (videoIds.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videoIds.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [videoIds.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videoIds.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + videoIds.length) % videoIds.length);
  };

  const handleScrollToCatalog = () => {
    if (onExploreClick) {
      onExploreClick();
      return;
    }
    const el = document.getElementById('catalogo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-[82vh] sm:h-[88vh] min-h-[560px] max-h-[860px] overflow-hidden isolate flex items-center justify-center select-none">
      {/* Imagem de Fundo com as Thumbnails do Canal */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {videoIds.map((id, index) => (
          <div
            key={id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-70 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
            style={{
              transitionProperty: 'opacity, transform',
              transitionDuration: '1000ms',
            }}
          >
            <img
              src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
              alt="Capa de Vídeo Luke Manhwa"
              className="w-full h-full object-cover object-center animate-in fade-in"
              onError={(e) => {
                // Fallback para hqdefault se maxresdefault não estiver disponível
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('hqdefault')) {
                  target.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
                }
              }}
            />
          </div>
        ))}

        {/* Gradiente escuro superior para o Navbar */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/35 to-transparent z-[1]" />

        {/* Ambient roxo sutil integrado ao tema Luke Manhwa */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/30 via-transparent to-indigo-950/20 mix-blend-screen z-[1]" />

        {/* Gradiente inferior denso para transição sem corte com o catálogo */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E] via-[#0B0B0E]/65 to-transparent z-[1]" />
      </div>

      {/* Conteúdo em Primeiro Plano (Estilo Roblox) */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-10 h-full flex flex-col justify-end pb-14 sm:pb-20">
        <div className="max-w-2xl space-y-4 sm:space-y-5 animate-in fade-in duration-700">
          {/* Título Principal com Tipografia Pesada Roblox */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.05] drop-shadow-2xl">
            Luke Manhwa, <br />
            obras do canal.
          </h1>

          {/* Subtítulo Estilo Roblox */}
          <p className="text-sm sm:text-base md:text-lg text-zinc-300/95 max-w-xl font-normal leading-relaxed drop-shadow">
            Leia resenhas completas, encontre novos manhwas para maratonar e assista a análises e clipes exclusivos do canal.
          </p>

          {/* Botões Lado a Lado no Formato do Roblox */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleScrollToCatalog}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-xl shadow-purple-600/30 transition-all active:scale-95"
            >
              Explorar obras
            </button>

            <a
              href="#inscritos"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm backdrop-blur-md border border-white/10 transition-all active:scale-95 shadow-md"
            >
              <span>Recomendações dos Inscritos</span>
            </a>

            <a
              href="https://discord.gg/arWFjTdbhT"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/30 text-[#d8dbff] hover:text-white font-medium text-xs sm:text-sm backdrop-blur-md border border-[#5865F2]/30 transition-all active:scale-95 group/discord"
            >
              <svg className="w-4 h-4 fill-current text-[#7289da] group-hover/discord:text-white transition-colors" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              <span>Discord</span>
            </a>

            <a
              href="https://www.youtube.com/@lukezinhorecap"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-zinc-300 hover:text-white font-medium text-xs sm:text-sm backdrop-blur-md border border-white/10 transition-all active:scale-95"
              title="Canal Principal Luke Manhwa"
            >
              <Youtube className="w-4 h-4 text-red-500 fill-current" />
              <span>Canal 1</span>
            </a>

            <a
              href="https://www.youtube.com/@manhwaluke"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/15 hover:bg-red-600/25 text-red-200 hover:text-white font-medium text-xs sm:text-sm backdrop-blur-md border border-red-500/25 transition-all active:scale-95"
              title="Canal Secundário (@manhwaluke)"
            >
              <Youtube className="w-4 h-4 text-red-400" />
              <span>Canal 2</span>
            </a>
          </div>
        </div>

        {/* Controles de Navegação da Thumbnail (Estilo Roblox/Apple) */}
        {videoIds.length > 1 && (
          <div className="absolute bottom-8 right-4 sm:right-10 flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-8 h-8 rounded-xl bg-black/60 hover:bg-black/80 text-zinc-300 hover:text-white backdrop-blur-xl border border-white/10 transition-all flex items-center justify-center active:scale-90 shadow-lg"
              title="Capa anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              className="px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-zinc-300 hover:text-white text-xs backdrop-blur-xl border border-white/10 transition-all flex items-center gap-1.5 active:scale-95 shadow-lg"
              title="Próxima capa"
            >
              <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
              <span>Alternar capa</span>
              <span className="text-[10px] text-purple-400 font-mono">
                {currentIndex + 1}/{videoIds.length}
              </span>
            </button>

            <button
              onClick={handleNext}
              className="w-8 h-8 rounded-xl bg-black/60 hover:bg-black/80 text-zinc-300 hover:text-white backdrop-blur-xl border border-white/10 transition-all flex items-center justify-center active:scale-90 shadow-lg"
              title="Próxima capa"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
