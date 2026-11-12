'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  X,
  ExternalLink,
  Star,
  Flame,
  Youtube,
  BookOpen,
  User,
  Calendar,
  Play,
  Film
} from 'lucide-react';
import { Manhwa } from '@/types/manhwa';
import { getSafeCoverUrl } from '@/lib/covers';
import { getYouTubeEmbedUrl } from '@/lib/video';

interface ManhwaModalProps {
  manhwa: Manhwa | null;
  onClose: () => void;
}

export default function ManhwaModal({ manhwa, onClose }: ManhwaModalProps) {
  const [imgSrc, setImgSrc] = useState(getSafeCoverUrl(manhwa?.coverUrl));
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (manhwa?.coverUrl) {
      setImgSrc(getSafeCoverUrl(manhwa.coverUrl));
    }
    setShowVideo(false);
  }, [manhwa]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (manhwa) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [manhwa, onClose]);

  if (!manhwa) return null;

  const embedUrl = getYouTubeEmbedUrl(manhwa.lukeVideoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop Escurecido com Blur estilo iOS */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#18181D]/95 border border-white/10 rounded-[28px] overflow-hidden shadow-2xl shadow-purple-950/40 z-10 my-auto animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Banner Desfocado com a capa do Manhwa no fundo */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-zinc-950 shrink-0">
          <img
            src={imgSrc || getSafeCoverUrl(manhwa.coverUrl)}
            alt={manhwa.title}
            className="w-full h-full object-cover blur-2xl scale-125 opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#18181D]/60 to-[#18181D]" />

          {/* Botão Fechar estilo iOS */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-zinc-300 hover:text-white flex items-center justify-center backdrop-blur-lg border border-white/10 transition-all ios-btn z-20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com Scroll Suave */}
        <div className="px-6 pb-6 pt-0 -mt-24 sm:-mt-28 relative overflow-y-auto flex-1">
          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
            {/* Capa com borda e sombra */}
            <div className="relative w-36 sm:w-44 aspect-[3/4.2] rounded-[20px] overflow-hidden shadow-2xl shadow-black/80 border-2 border-white/15 shrink-0 bg-zinc-900">
              <img
                src={imgSrc || getSafeCoverUrl(manhwa.coverUrl)}
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
            </div>

            {/* Metadados do Título */}
            <div className="flex-1 flex flex-col justify-end pt-2 sm:pt-14">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                {manhwa.lukeRecommended && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-600 text-white shadow-md shadow-purple-900/50">
                    <Flame className="w-3 h-3 text-amber-300" />
                    RECOMENDADO PELO LUKE
                  </span>
                )}
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                  {manhwa.status === 'completed' ? 'Finalizado' : 'Em Lançamento'}
                </span>
                {manhwa.rating && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                    {manhwa.rating} / 10
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                {manhwa.title}
              </h2>
              {manhwa.originalTitle && (
                <p className="text-xs text-purple-300/80 font-medium mt-0.5">
                  {manhwa.originalTitle}
                </p>
              )}

              {/* Informações de Autor & Ano */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 mt-2.5 text-xs text-zinc-400">
                {manhwa.author && (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-zinc-500" />
                    {manhwa.author}
                  </span>
                )}
                {manhwa.releaseYear && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-zinc-500" />
                    {manhwa.releaseYear}
                  </span>
                )}
                {manhwa.totalChapters && (
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-zinc-500" />
                    {manhwa.totalChapters} Capítulos
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Gêneros */}
          <div className="flex flex-wrap items-center gap-1.5 mt-5">
            {manhwa.genres.map((genre, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5 transition-colors"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* SEÇÃO DO VÍDEO DO CANAL LUKE MANHWA */}
          {manhwa.lukeVideoUrl && (
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-red-950/25 via-purple-950/25 to-zinc-900 border border-red-500/25 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
                    <Youtube className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">
                      Vídeo do Canal Luke Manhwa
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      Análise e recomendação completa desta obra
                    </p>
                  </div>
                </div>

                {embedUrl && (
                  <button
                    onClick={() => setShowVideo(!showVideo)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md shadow-red-900/40 transition-all ios-btn"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{showVideo ? 'Ocultar Player' : 'Assistir Aqui'}</span>
                  </button>
                )}
              </div>

              {/* Player do YouTube Embutido estilo Apple TV */}
              {showVideo && embedUrl && (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black mt-3 animate-in zoom-in-95 duration-200">
                  <iframe
                    src={embedUrl}
                    title={`Vídeo do Luke Manhwa - ${manhwa.title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="w-full h-full border-0"
                  />
                </div>
              )}
            </div>
          )}

          {/* Resenha / Comentário do Luke se houver */}
          {manhwa.lukeReview && (
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 to-indigo-950/30 border border-purple-500/25">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300 mb-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                <span>Opinião do Luke Manhwa:</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed italic">
                "{manhwa.lukeReview}"
              </p>
            </div>
          )}

          {/* Sinopse */}
          <div className="mt-5">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-2">
              Sinopse
            </h4>
            <p className="text-sm text-zinc-300 leading-relaxed max-h-48 overflow-y-auto pr-1">
              {manhwa.synopsis}
            </p>
          </div>

          {/* Botões de Ação estilo Apple iOS */}
          <div className="flex flex-wrap items-center gap-2.5 mt-6 pt-4 border-t border-white/10">
            {manhwa.mangadexUrl && (
              <a
                href={manhwa.mangadexUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all ios-btn"
              >
                <span>Ver no MangaDex</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {manhwa.lukeVideoUrl && (
              <a
                href={manhwa.lukeVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-red-600/20 hover:bg-red-600/30 text-red-200 border border-red-500/30 font-medium text-xs sm:text-sm transition-all ios-btn"
              >
                <Youtube className="w-4 h-4 text-red-400" />
                <span>Abrir no YouTube</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-zinc-200 font-medium text-xs sm:text-sm border border-white/10 transition-all ios-btn"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
