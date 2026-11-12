'use client';

import React from 'react';
import Image from 'next/image';
import { Flame, Star, ArrowRight, Play, Youtube } from 'lucide-react';
import { Manhwa } from '@/types/manhwa';
import { getSafeCoverUrl } from '@/lib/covers';

interface HeroFeaturedProps {
  manhwa: Manhwa;
  onSelect: (manhwa: Manhwa) => void;
}

export default function HeroFeatured({ manhwa, onSelect }: HeroFeaturedProps) {
  const [imgSrc, setImgSrc] = React.useState(getSafeCoverUrl(manhwa.coverUrl));

  React.useEffect(() => {
    setImgSrc(getSafeCoverUrl(manhwa.coverUrl));
  }, [manhwa.coverUrl]);

  return (
    <div className="relative w-full rounded-[28px] overflow-hidden ios-glass border border-white/10 shadow-2xl shadow-purple-950/20 group">
      {/* Background Desfocado & Ambient Lighting */}
      <div className="absolute inset-0">
        <img
          src={imgSrc}
          alt={manhwa.title}
          className="w-full h-full object-cover blur-3xl opacity-25 scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E12] via-[#0E0E12]/90 to-transparent" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row items-center gap-6 sm:gap-10">
        {/* Capa com Projeção 3D / Sombra Flutuante */}
        <div
          onClick={() => onSelect(manhwa)}
          className="relative w-44 sm:w-56 aspect-[3/4.2] rounded-[22px] overflow-hidden shadow-2xl shadow-purple-900/40 border border-white/20 shrink-0 cursor-pointer group-hover:scale-[1.02] transition-transform duration-300 bg-zinc-900"
        >
          <img
            src={imgSrc}
            alt={manhwa.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => {
              if (!imgSrc.includes('/api/cover')) {
                setImgSrc(`/api/cover?url=${encodeURIComponent(manhwa.coverUrl)}`);
              } else {
                setImgSrc('https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80');
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
            <span className="font-semibold text-amber-300 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              {manhwa.rating || '9.9'}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-600/90">
              Destaque
            </span>
          </div>
        </div>

        {/* Textos & Botões */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-purple-600/20 text-purple-300 border border-purple-500/30">
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              OBRA EM DESTAQUE DO CANAL
            </span>
            <span className="text-xs text-zinc-400">
              {manhwa.status === 'completed' ? 'Finalizado' : 'Em Lançamento'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {manhwa.title}
          </h1>

          {manhwa.originalTitle && (
            <p className="text-sm text-purple-300/80 font-medium mt-1">
              {manhwa.originalTitle}
            </p>
          )}

          <p className="text-sm text-zinc-300 line-clamp-3 sm:line-clamp-4 mt-3 max-w-2xl leading-relaxed">
            {manhwa.synopsis}
          </p>

          {/* Gêneros */}
          <div className="flex flex-wrap gap-1.5 my-4">
            {manhwa.genres.slice(0, 4).map((g, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-zinc-300 border border-white/5"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <button
              onClick={() => onSelect(manhwa)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm shadow-lg shadow-purple-600/30 transition-all ios-btn"
            >
              <span>Ver Sinopse & Detalhes</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {manhwa.lukeVideoUrl && (
              <button
                onClick={() => onSelect(manhwa)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-600/20 hover:bg-red-600/30 text-red-200 border border-red-500/30 font-medium text-sm transition-all ios-btn"
              >
                <Youtube className="w-4 h-4 text-red-400" />
                <span>Vídeo do Luke</span>
              </button>
            )}

            {manhwa.lukeReview && !manhwa.lukeVideoUrl && (
              <button
                onClick={() => onSelect(manhwa)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-zinc-200 font-medium text-sm border border-white/10 transition-all ios-btn"
              >
                <span>Resenha do Luke</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

