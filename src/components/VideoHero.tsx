'use client';

import React, { useState, useEffect } from 'react';
import { ArrowDown, Youtube, Volume2, VolumeX, Sparkles, BookOpen } from 'lucide-react';
import { Manhwa } from '@/types/manhwa';
import { getYouTubeEmbedUrl } from '@/lib/video';

interface VideoHeroProps {
  manhwas: Manhwa[];
  onExploreClick?: () => void;
}

export default function VideoHero({ manhwas, onExploreClick }: VideoHeroProps) {
  // Pega os vídeos vinculados às obras ou usa o vídeo padrão do Luke
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
    // Se não tiver nenhum nas obras, usa o vídeo padrão do Luke
    if (list.length === 0) {
      list.push('CgyXHx6h2a8');
    }
    return list;
  }, [manhwas]);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const currentVideoId = videoIds[currentVideoIndex] || 'CgyXHx6h2a8';

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
    <section className="relative w-full h-[72vh] sm:h-[82vh] min-h-[540px] max-h-[820px] overflow-hidden -mt-[69px] pt-[69px] flex items-center justify-center">
      {/* Container do Vídeo em Background (Estilo Roblox / Apple TV) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none -z-10 bg-[#0B0B0E]">
        <div className="relative w-full h-full flex items-center justify-center">
          <iframe
            key={currentVideoId}
            src={`https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${currentVideoId}&playsinline=1&rel=0&showinfo=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&disablekb=1`}
            title="Vídeo de Fundo Luke Manhwa"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            className="w-[180vw] h-[180vh] min-w-[1400px] min-h-[850px] object-cover scale-125 opacity-75 sm:opacity-70 pointer-events-none transition-opacity duration-1000"
          />
        </div>

        {/* Camadas de Gradientes Cinematográficos (Para o texto ficar perfeitamente legível) */}
        {/* Gradiente escuro no topo para o Navbar */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
        
        {/* Gradiente roxo ambiental Luke Manhwa */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/40 via-transparent to-indigo-950/30 mix-blend-screen" />

        {/* Gradiente denso inferior para transição suave com o catálogo */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0E] via-[#0B0B0E]/75 to-transparent" />
      </div>

      {/* Conteúdo em Primeiro Plano (Estilo Roblox) */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 h-full flex flex-col justify-end pb-12 sm:pb-16">
        <div className="max-w-3xl space-y-4 sm:space-y-5 animate-in fade-in duration-700">
          {/* Badge estilo iOS */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 backdrop-blur-xl border border-purple-500/30 text-purple-300 text-xs font-semibold shadow-lg shadow-purple-950/40">
            <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
            <span>Canal Oficial • Luke Manhwa</span>
          </div>

          {/* Título Principal Impactante (como na foto do Roblox) */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08] drop-shadow-2xl">
            Uma plataforma. <br />
            <span className="purple-gradient-text">Centenas de manhwas.</span>
          </h1>

          {/* Subtítulo / Descrição */}
          <p className="text-sm sm:text-lg text-zinc-300/95 max-w-2xl leading-relaxed drop-shadow font-normal">
            Descubra os melhores manhwas, assista a análises e resenhas exclusivas do canal e encontre sua próxima grande leitura recomendada pelo Luke.
          </p>

          {/* Botões de Ação estilo Roblox / Apple */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={handleScrollToCatalog}
              className="flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm sm:text-base shadow-xl shadow-purple-600/40 transition-all ios-btn"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explorar Catálogo</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <a
              href="https://www.youtube.com/@lukemanhwa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base backdrop-blur-xl border border-white/15 transition-all ios-btn shadow-lg"
            >
              <Youtube className="w-5 h-5 text-red-500 fill-current" />
              <span>Canal no YouTube</span>
            </a>
          </div>
        </div>

        {/* Indicador e Controle de Vídeo no Canto Inferior Direito */}
        {videoIds.length > 1 && (
          <div className="absolute bottom-8 right-4 sm:right-8 flex items-center gap-2">
            <button
              onClick={() => setCurrentVideoIndex((prev) => (prev + 1) % videoIds.length)}
              className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-zinc-300 hover:text-white text-xs backdrop-blur-xl border border-white/10 transition-all flex items-center gap-1.5"
              title="Trocar vídeo de fundo"
            >
              <span>Próximo Vídeo</span>
              <span className="text-[10px] text-purple-400 font-mono">
                {currentVideoIndex + 1}/{videoIds.length}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
