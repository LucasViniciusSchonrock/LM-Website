'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Flame, CheckCircle2, Clock, Youtube } from 'lucide-react';
import { Manhwa } from '@/types/manhwa';
import { getSafeCoverUrl } from '@/lib/covers';

interface ManhwaCardProps {
  manhwa: Manhwa;
  onSelect: (manhwa: Manhwa) => void;
}

export default function ManhwaCard({ manhwa, onSelect }: ManhwaCardProps) {
  const [imgSrc, setImgSrc] = React.useState(getSafeCoverUrl(manhwa.coverUrl));

  React.useEffect(() => {
    setImgSrc(getSafeCoverUrl(manhwa.coverUrl));
  }, [manhwa.coverUrl]);

  return (
    <div
      onClick={() => onSelect(manhwa)}
      className="group relative cursor-pointer flex flex-col rounded-[22px] overflow-hidden ios-glass-card hover:border-purple-500/40"
    >
      {/* Capa com proporção vertical */}
      <div className="relative w-full aspect-[3/4.2] overflow-hidden bg-zinc-900">
        <img
          src={imgSrc}
          alt={manhwa.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => {
            if (!imgSrc.includes('/api/cover')) {
              setImgSrc(`/api/cover?url=${encodeURIComponent(manhwa.coverUrl)}`);
            } else {
              setImgSrc('https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80');
            }
          }}
        />

        {/* Gradiente estilo Apple na parte inferior da capa */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-black/30 opacity-90 group-hover:opacity-75 transition-opacity" />

        {/* Badges superiores flutuantes */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
          <div className="flex items-center gap-1">
            {manhwa.lukeRecommended && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide bg-purple-600/90 text-white backdrop-blur-md shadow-lg shadow-purple-900/50">
                <Flame className="w-3 h-3 text-amber-300" />
                TOP LUKE
              </span>
            )}
            {manhwa.lukeVideoUrl && (
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-600/90 text-white backdrop-blur-md shadow-lg shadow-red-900/50" title="Possui vídeo no canal">
                <Youtube className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          {manhwa.rating && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-black/60 text-amber-300 backdrop-blur-md border border-white/10">
              <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
              {manhwa.rating}
            </span>
          )}
        </div>

        {/* Status na parte inferior sobre a capa */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px]">
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-zinc-300 border border-white/10 flex items-center gap-1">
            {manhwa.status === 'completed' ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Finalizado</span>
              </>
            ) : (
              <>
                <Clock className="w-3 h-3 text-purple-400" />
                <span>Lançamento</span>
              </>
            )}
          </span>

          {manhwa.totalChapters && (
            <span className="text-zinc-400 text-[10px] font-medium px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-sm">
              {manhwa.totalChapters} caps
            </span>
          )}
        </div>
      </div>

      {/* Informações da Obra */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2 bg-[#141418]/90">
        <div>
          <h3 className="font-semibold text-sm sm:text-base text-zinc-100 line-clamp-1 group-hover:text-purple-300 transition-colors">
            {manhwa.title}
          </h3>
          {manhwa.originalTitle && (
            <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5 font-light">
              {manhwa.originalTitle}
            </p>
          )}
        </div>

        {/* Gêneros / Tags estilo pílulas iOS */}
        <div className="flex flex-wrap gap-1 mt-1">
          {manhwa.genres.slice(0, 2).map((genre, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/5"
            >
              {genre}
            </span>
          ))}
          {manhwa.genres.length > 2 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-zinc-400">
              +{manhwa.genres.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

