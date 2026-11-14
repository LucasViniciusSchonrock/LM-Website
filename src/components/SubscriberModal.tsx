'use client';

import React from 'react';
import { X, ExternalLink, Crown, Users, Star, BookOpen, MessageSquare } from 'lucide-react';
import { SubscriberRecommendation } from '@/types/manhwa';
import { getSafeCoverUrl } from '@/lib/covers';

interface SubscriberModalProps {
  recommendation: SubscriberRecommendation | null;
  onClose: () => void;
}

export default function SubscriberModal({ recommendation, onClose }: SubscriberModalProps) {
  if (!recommendation) return null;

  const imgSrc = getSafeCoverUrl(recommendation.coverUrl);
  const avatarUrl =
    recommendation.suggestedAvatar ||
    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(recommendation.suggestedBy || 'Inscrito')}`;

  const genres = recommendation.genre
    ? recommendation.genre.split(/[•,]/).map((g) => g.trim()).filter(Boolean)
    : [];

  const votesCount = recommendation.points || recommendation.count || 1;

  const isLukeBrave =
    (recommendation.suggestedBy || '').toLowerCase().includes('luke') ||
    (recommendation.suggestedBy || '').toLowerCase().includes('brave') ||
    (recommendation.id || '').toLowerCase().includes('brave');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#141418] border border-white/15 rounded-3xl shadow-2xl z-10 scrollbar-none flex flex-col md:flex-row gap-6 p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Capa */}
        <div className="w-full md:w-56 shrink-0 flex flex-col items-center">
          <div className="relative w-44 md:w-full aspect-[3/4.2] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-zinc-900">
            <img
              src={imgSrc}
              alt={recommendation.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Quem indicou card (Apenas exibe se for inscrito real, não Luke Brave) */}
          {!isLukeBrave && (
            <div className="w-full mt-4 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <img
                src={avatarUrl}
                alt={recommendation.suggestedBy}
                className="w-9 h-9 rounded-full bg-zinc-800 border border-white/15"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                  Sugerido por
                </span>
                <p className="text-sm font-bold text-white truncate">
                  {recommendation.suggestedBy || 'Inscrito do Canal'}
                </p>
                {recommendation.isMember && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 font-semibold">
                    <Crown className="w-3 h-3 fill-current" />
                    <span>{recommendation.memberTier || 'Membro do Canal'}</span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Detalhes e Ações */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-600/30 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>Indicação da Comunidade</span>
              </span>

              {votesCount > 1 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{votesCount} apoios no chat</span>
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {recommendation.title}
            </h2>

            {recommendation.mangadexTitle && recommendation.mangadexTitle !== recommendation.title && (
              <p className="text-xs text-purple-300/80 font-medium mt-1">
                Título alternativo: {recommendation.mangadexTitle}
              </p>
            )}

            {/* Gêneros */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {genres.map((g, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Notas / Mensagem do inscrito */}
            {recommendation.notes && (
              <div className="mt-4 p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-xs text-zinc-300">
                <div className="flex items-center gap-1.5 text-purple-300 font-semibold mb-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Recado do inscrito:</span>
                </div>
                <p className="italic">{recommendation.notes}</p>
              </div>
            )}

            {/* Apoiadores da Live */}
            {Array.isArray(recommendation.supporters) && recommendation.supporters.length > 0 && (
              <div className="mt-4">
                <span className="text-xs text-zinc-400 font-medium block mb-1.5">
                  Apoiado por inscritos da Live:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {recommendation.supporters.map((sup, idx) => {
                    const name = typeof sup === 'string' ? sup : sup.user;
                    return (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-0.5 rounded-lg bg-white/5 text-zinc-300 border border-white/5 flex items-center gap-1"
                      >
                        <span>{name}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
            {recommendation.readUrl ? (
              <a
                href={recommendation.readUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>Ler Obra Online</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            ) : (
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(recommendation.title + ' manhwa ler online')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>Buscar Onde Ler</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            )}

            <a
              href={`https://mangadex.org/search?q=${encodeURIComponent(recommendation.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 text-xs sm:text-sm font-semibold transition-all active:scale-95"
            >
              <span>Ver no MangaDex</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
