'use client';

import React, { useState, useRef } from 'react';
import { ExternalLink, Crown, Users, BookOpen, Star } from 'lucide-react';
import { SubscriberRecommendation } from '@/types/manhwa';
import { getSafeCoverUrl } from '@/lib/covers';
import { extractCoverAccentColor, getFallbackColor } from '@/lib/color';

interface SubscriberCardProps {
  recommendation: SubscriberRecommendation;
  onSelect?: (rec: SubscriberRecommendation) => void;
}

export default function SubscriberCard({ recommendation, onSelect }: SubscriberCardProps) {
  const [imgSrc, setImgSrc] = useState(getSafeCoverUrl(recommendation.coverUrl));
  const [accentColor, setAccentColor] = useState(() => getFallbackColor(recommendation.title));
  const [isHovered, setIsHovered] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Verifica se a sugestão veio do Luke Brave para ocultar o nome e deixar sem user
  const isLukeBrave = React.useMemo(() => {
    const by = (recommendation.suggestedBy || '').toLowerCase();
    const id = (recommendation.id || '').toLowerCase();
    return by.includes('luke') || by.includes('brave') || id.includes('brave');
  }, [recommendation.suggestedBy, recommendation.id]);

  const avatarUrl =
    recommendation.suggestedAvatar ||
    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(recommendation.suggestedBy || 'Inscrito')}`;

  const genres = React.useMemo(() => {
    if (!recommendation.genre) return [];
    return recommendation.genre.split(/[•,]/).map((g) => g.trim()).filter(Boolean);
  }, [recommendation.genre]);

  const votesCount = recommendation.points || recommendation.count || 1;

  const handleImageLoad = () => {
    if (imgRef.current) {
      const color = extractCoverAccentColor(imgRef.current, recommendation.title);
      setAccentColor(color);
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(recommendation)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderColor: isHovered ? accentColor : 'rgba(255, 255, 255, 0.1)',
        boxShadow: isHovered
          ? `0 16px 36px -8px ${accentColor}40, 0 0 20px -2px ${accentColor}25`
          : undefined,
      }}
      className="group relative cursor-pointer flex flex-col rounded-2xl overflow-hidden bg-[#141418] border transition-all duration-300"
    >
      {/* Capa com proporção vertical 3:4 */}
      <div className="relative w-full aspect-[3/4.2] overflow-hidden bg-zinc-900">
        <img
          ref={imgRef}
          src={imgSrc}
          alt={recommendation.title}
          crossOrigin="anonymous"
          onLoad={handleImageLoad}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => {
            if (!imgSrc.includes('/api/cover') && recommendation.coverUrl?.includes('mangadex.org')) {
              setImgSrc(`/api/cover?url=${encodeURIComponent(recommendation.coverUrl)}`);
            } else {
              setImgSrc(
                'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80'
              );
            }
          }}
        />

        {/* Gradiente escuro inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-black/30 opacity-90 group-hover:opacity-75 transition-opacity" />

        {/* Brilho da cor destaque da capa na parte inferior */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/3 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${accentColor}, transparent)`,
          }}
        />

        {/* Badges superiores flutuantes */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
          {recommendation.isMember || recommendation.hasMemberSupport ? (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-md">
              <Crown className="w-3 h-3 fill-current" />
              <span>MEMBRO</span>
            </span>
          ) : !isLukeBrave ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/60 text-zinc-300 backdrop-blur-md border border-white/10">
              <Users className="w-3 h-3 text-purple-400" />
              <span>Inscrito</span>
            </span>
          ) : (
            <span />
          )}

          {votesCount > 1 && (
            <span
              style={{ backgroundColor: `${accentColor}E6` }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white backdrop-blur-md shadow-md"
            >
              <Star className="w-3 h-3 fill-current" />
              <span>{votesCount} votos</span>
            </span>
          )}
        </div>

        {/* Gênero principal na parte inferior da capa */}
        {genres.length > 0 && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-zinc-300 border border-white/10 line-clamp-1 inline-block">
              {genres[0]}
            </span>
          </div>
        )}
      </div>

      {/* Informações da Obra */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5 bg-[#141418]">
        <div>
          <h3
            style={{ color: isHovered ? accentColor : undefined }}
            className="font-bold text-sm sm:text-base text-zinc-100 line-clamp-1 transition-colors duration-200"
          >
            {recommendation.title}
          </h3>

          {/* Quem indicou (Apenas exibe se NÃO for Luke Brave) */}
          {!isLukeBrave && (
            <div className="flex items-center gap-2 mt-2">
              <img
                src={avatarUrl}
                alt={recommendation.suggestedBy}
                className="w-5 h-5 rounded-full bg-zinc-800 border border-white/10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-zinc-300 font-medium truncate">
                  {recommendation.suggestedBy || 'Inscrito da Live'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Botão de Ler ou Ver Detalhes */}
        <div className="pt-1 flex items-center justify-between border-t border-white/[0.06] text-xs">
          <span className="text-[11px] text-zinc-400 flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-purple-400" />
            <span>Ver detalhes</span>
          </span>

          {recommendation.readUrl && (
            <a
              href={recommendation.readUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ color: isHovered ? accentColor : undefined }}
              className="text-purple-400 hover:opacity-80 flex items-center gap-1 text-[11px] font-medium transition-colors"
              title="Ler online em fonte externa"
            >
              <span>Ler</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
