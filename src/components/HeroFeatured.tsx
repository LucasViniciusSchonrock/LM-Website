'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Flame, Star, ArrowRight, Youtube, ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';
import { Manhwa } from '@/types/manhwa';
import { getSafeCoverUrl } from '@/lib/covers';
import { extractCoverAccentColor, getFallbackColor } from '@/lib/color';

interface HeroFeaturedProps {
  manhwas: Manhwa[];
  onSelect: (manhwa: Manhwa) => void;
}

const ROTATION_INTERVAL = 15000; // 15 segundos

export default function HeroFeatured({ manhwas, onSelect }: HeroFeaturedProps) {
  // Lista de obras em destaque (com isFeatured ou lukeRecommended, ou todas)
  const featuredList = useMemo(() => {
    const list = manhwas.filter((m) => m.isFeatured || m.lukeRecommended);
    return list.length > 0 ? list : manhwas;
  }, [manhwas]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentManhwa = featuredList[currentIndex] || manhwas[0];
  const [imgSrc, setImgSrc] = useState(getSafeCoverUrl(currentManhwa?.coverUrl));
  const [accentColor, setAccentColor] = useState(() => getFallbackColor(currentManhwa?.title || ''));
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (currentManhwa) {
      setImgSrc(getSafeCoverUrl(currentManhwa.coverUrl));
      setAccentColor(getFallbackColor(currentManhwa.title));
    }
  }, [currentManhwa]);

  const handleImageLoad = () => {
    if (imgRef.current && currentManhwa) {
      const color = extractCoverAccentColor(imgRef.current, currentManhwa.title);
      setAccentColor(color);
    }
  };

  // Timer de 15 segundos com barra de progresso suave
  useEffect(() => {
    if (featuredList.length <= 1) return;

    setProgress(0);
    const stepTime = 100; // atualiza a cada 100ms
    const totalSteps = ROTATION_INTERVAL / stepTime;
    let step = 0;

    const interval = setInterval(() => {
      if (!isPaused) {
        step++;
        setProgress((step / totalSteps) * 100);

        if (step >= totalSteps) {
          step = 0;
          setProgress(0);
          setCurrentIndex((prev) => (prev + 1) % featuredList.length);
        }
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, featuredList.length]);

  const handleNext = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % featuredList.length);
  };

  const handlePrev = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + featuredList.length) % featuredList.length);
  };

  if (!currentManhwa) return null;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        borderColor: `${accentColor}35`,
        boxShadow: `0 24px 60px -12px ${accentColor}30, 0 0 35px -5px ${accentColor}15`,
      }}
      className="relative w-full rounded-[28px] overflow-hidden ios-glass border shadow-2xl group select-none transition-all duration-700"
    >
      {/* Background Desfocado & Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          key={`bg-${currentManhwa.id}`}
          src={imgSrc}
          alt={currentManhwa.title}
          className="w-full h-full object-cover blur-3xl opacity-25 scale-110 animate-in fade-in duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E12] via-[#0E0E12]/90 to-transparent" />
      </div>

      {/* Conteúdo Principal */}
      <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row items-center gap-6 sm:gap-10">
        {/* Capa com Projeção 3D / Sombra Flutuante */}
        <div
          onClick={() => onSelect(currentManhwa)}
          style={{
            borderColor: `${accentColor}40`,
            boxShadow: `0 20px 40px -10px ${accentColor}50`,
          }}
          className="relative w-44 sm:w-56 aspect-[3/4.2] rounded-[22px] overflow-hidden border shrink-0 cursor-pointer group-hover:scale-[1.02] transition-transform duration-300 bg-zinc-900"
        >
          <img
            ref={imgRef}
            key={`cover-${currentManhwa.id}`}
            src={imgSrc}
            alt={currentManhwa.title}
            crossOrigin="anonymous"
            onLoad={handleImageLoad}
            className="w-full h-full object-cover animate-in fade-in duration-500"
            referrerPolicy="no-referrer"
            onError={() => {
              if (!imgSrc.includes('/api/cover')) {
                setImgSrc(`/api/cover?url=${encodeURIComponent(currentManhwa.coverUrl)}`);
              } else {
                setImgSrc(
                  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80'
                );
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
            <span className="font-semibold text-amber-300 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              {currentManhwa.rating || '9.8'}
            </span>
            <span
              style={{ backgroundColor: accentColor }}
              className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full text-white shadow-md"
            >
              Destaque
            </span>
          </div>
        </div>

        {/* Textos & Botões */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
            <span
              style={{
                backgroundColor: `${accentColor}20`,
                borderColor: `${accentColor}40`,
                color: accentColor,
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border"
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              OBRA EM DESTAQUE DO CANAL
            </span>

            <span className="text-xs text-zinc-400">
              {currentManhwa.status === 'completed' ? 'Finalizado' : 'Em Lançamento'}
            </span>

            {isPaused && (
              <span className="text-[10px] text-zinc-400 font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-1">
                <Pause className="w-2.5 h-2.5 text-purple-300" />
                <span>Pausado</span>
              </span>
            )}
          </div>

          <h1
            key={`title-${currentManhwa.id}`}
            className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight animate-in fade-in duration-500"
          >
            {currentManhwa.title}
          </h1>

          {currentManhwa.originalTitle && (
            <p className="text-sm text-purple-300/80 font-medium mt-1 truncate max-w-full">
              {currentManhwa.originalTitle}
            </p>
          )}

          <p
            key={`synopsis-${currentManhwa.id}`}
            className="text-sm text-zinc-300 line-clamp-3 sm:line-clamp-4 mt-3 max-w-2xl leading-relaxed animate-in fade-in duration-500"
          >
            {currentManhwa.synopsis}
          </p>

          {/* Gêneros */}
          <div className="flex flex-wrap gap-1.5 my-4 justify-center md:justify-start">
            {currentManhwa.genres.slice(0, 4).map((g, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-zinc-300 border border-white/5"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-wrap items-center gap-3 mt-1 justify-center md:justify-start">
            <button
              onClick={() => onSelect(currentManhwa)}
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 8px 24px -4px ${accentColor}60`,
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl text-white font-medium text-sm transition-all ios-btn active:scale-95"
            >
              <span>Ver Sinopse & Detalhes</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {currentManhwa.lukeVideoUrl && (
              <button
                onClick={() => onSelect(currentManhwa)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-600/20 hover:bg-red-600/30 text-red-200 border border-red-500/30 font-medium text-sm transition-all ios-btn active:scale-95"
              >
                <Youtube className="w-4 h-4 text-red-400" />
                <span>Vídeo do Luke</span>
              </button>
            )}

            {currentManhwa.lukeReview && !currentManhwa.lukeVideoUrl && (
              <button
                onClick={() => onSelect(currentManhwa)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-zinc-200 font-medium text-sm border border-white/10 transition-all ios-btn active:scale-95"
              >
                <span>Resenha do Luke</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Controles do Carrossel e Barra de Progresso de 15 Segundos */}
      {featuredList.length > 1 && (
        <div className="relative z-10 px-6 sm:px-10 pb-4 flex items-center justify-between gap-4 border-t border-white/[0.06] pt-3">
          {/* Navegação por Dots & Setas */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-all active:scale-90"
              title="Obra anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 px-2">
              {featuredList.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setProgress(0);
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'w-6 bg-purple-500 shadow-md shadow-purple-500/50'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  title={m.title}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-all active:scale-90"
              title="Próxima obra"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Indicador de tempo restante (15s) */}
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="text-[11px] font-mono">
              {currentIndex + 1}/{featuredList.length}
            </span>
            <span className="hidden sm:inline text-[11px] text-zinc-500">
              {isPaused ? '(pausado)' : 'muda a cada 15s'}
            </span>
          </div>
        </div>
      )}

      {/* Barra de Progresso dos 15 Segundos na Borda Inferior */}
      {featuredList.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/[0.06] overflow-hidden">
          <div
            className="h-full transition-all duration-100 ease-linear shadow-sm"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(to right, ${accentColor}, #8B5CF6)`,
              boxShadow: `0 0 12px ${accentColor}`,
            }}
          />
        </div>
      )}
    </div>
  );
}
