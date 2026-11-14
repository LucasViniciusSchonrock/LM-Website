'use client';

import React, { useState, useMemo } from 'react';
import { Search, Flame, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { Manhwa } from '@/types/manhwa';
import ManhwaCard from './ManhwaCard';
import ManhwaModal from './ManhwaModal';
import HeroFeatured from './HeroFeatured';
import ScrollReveal from './ScrollReveal';

interface CatalogViewProps {
  initialManhwas: Manhwa[];
}

export default function CatalogView({ initialManhwas }: CatalogViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'recommended' | 'ongoing' | 'completed'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedManhwa, setSelectedManhwa] = useState<Manhwa | null>(null);

  // Lista única de todos os gêneros presentes
  const allGenres = useMemo(() => {
    const set = new Set<string>();
    initialManhwas.forEach((m) => {
      m.genres?.forEach((g) => set.add(g));
    });
    return Array.from(set).sort();
  }, [initialManhwas]);

  // Filtragem
  const filteredManhwas = useMemo(() => {
    return initialManhwas.filter((manhwa) => {
      // Busca por texto
      const query = searchTerm.toLowerCase().trim();
      const matchSearch =
        !query ||
        manhwa.title.toLowerCase().includes(query) ||
        (manhwa.originalTitle && manhwa.originalTitle.toLowerCase().includes(query)) ||
        (manhwa.author && manhwa.author.toLowerCase().includes(query)) ||
        manhwa.genres.some((g) => g.toLowerCase().includes(query));

      // Filtro de status / recomendação
      let matchFilter = true;
      if (selectedFilter === 'recommended') matchFilter = !!manhwa.lukeRecommended;
      if (selectedFilter === 'ongoing') matchFilter = manhwa.status === 'ongoing';
      if (selectedFilter === 'completed') matchFilter = manhwa.status === 'completed';

      // Filtro de gênero
      let matchGenre = true;
      if (selectedGenre !== 'all') {
        matchGenre = manhwa.genres.includes(selectedGenre);
      }

      return matchSearch && matchFilter && matchGenre;
    });
  }, [initialManhwas, searchTerm, selectedFilter, selectedGenre]);

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Obra Destaque Rotativa (Alterna a cada 15 segundos) */}
      {!searchTerm && initialManhwas.length > 0 && (
        <ScrollReveal direction="up">
          <HeroFeatured manhwas={initialManhwas} onSelect={setSelectedManhwa} />
        </ScrollReveal>
      )}

      {/* Seção de Controles de Busca e Filtros estilo iOS com Scroll Reveal */}
      <ScrollReveal direction="up" delay={80}>
        <section className="space-y-4">
          {/* Barra de Busca estilo iOS */}
          <div className="relative max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título, autor, gênero..."
                className="w-full pl-12 pr-10 py-3 rounded-full bg-[#1A1A20]/80 border border-white/10 text-white placeholder-zinc-400 text-sm focus:outline-none focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/20 backdrop-blur-xl transition-all shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 px-2 py-0.5 text-xs text-zinc-400 hover:text-white rounded-full bg-white/10"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Segmented Controls estilo Apple iOS */}
          <div className="flex items-center justify-center">
            <div className="inline-flex p-1 rounded-2xl bg-[#141418] border border-white/10 shadow-lg">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Todas ({initialManhwas.length})
              </button>
              <button
                onClick={() => setSelectedFilter('recommended')}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedFilter === 'recommended'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                <span>Escolha do Luke</span>
              </button>
              <button
                onClick={() => setSelectedFilter('ongoing')}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedFilter === 'ongoing'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-purple-300" />
                <span>Em Lançamento</span>
              </button>
              <button
                onClick={() => setSelectedFilter('completed')}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedFilter === 'completed'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Finalizados</span>
              </button>
            </div>
          </div>

          {/* Pílulas de Gêneros estilo iOS Horizontal Scroll */}
          {allGenres.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none no-scrollbar justify-start sm:justify-center">
              <button
                onClick={() => setSelectedGenre('all')}
                className={`text-xs px-3 py-1 rounded-full shrink-0 transition-all ${
                  selectedGenre === 'all'
                    ? 'bg-white/20 text-white font-medium border border-white/20'
                    : 'bg-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/10'
                }`}
              >
                Todos os Gêneros
              </button>
              {allGenres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre === selectedGenre ? 'all' : genre)}
                  className={`text-xs px-3 py-1 rounded-full shrink-0 transition-all ${
                    selectedGenre === genre
                      ? 'bg-purple-600 text-white font-medium shadow-md shadow-purple-900/50'
                      : 'bg-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/10'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          )}
        </section>
      </ScrollReveal>

      {/* Grid de Obras Estilo Apple Books com Animação Scroll Reveal */}
      <section>
        <ScrollReveal direction="up" delay={50}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Explorar Todas as Obras
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                  {filteredManhwas.length} {filteredManhwas.length === 1 ? 'obra' : 'obras'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Capas em alta definição, sinopses completas e resenhas exclusivas do Luke
              </p>
            </div>

            {(searchTerm || selectedFilter !== 'all' || selectedGenre !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedFilter('all');
                  setSelectedGenre('all');
                }}
                className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-4 self-start sm:self-auto"
              >
                Resetar filtros
              </button>
            )}
          </div>
        </ScrollReveal>

        {filteredManhwas.length === 0 ? (
          <ScrollReveal direction="up">
            <div className="py-20 text-center rounded-[28px] ios-glass border border-white/10 space-y-3">
              <BookOpen className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-lg font-semibold text-zinc-300">
                Nenhuma obra encontrada
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Tente buscar por outro termo ou remova os filtros selecionados.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5">
            {filteredManhwas.map((manhwa, index) => (
              <ScrollReveal
                key={manhwa.id}
                delay={(index % 6) * 55}
                direction="up"
              >
                <ManhwaCard
                  manhwa={manhwa}
                  onSelect={setSelectedManhwa}
                />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* Modal Sheet de Detalhes da Obra */}
      <ManhwaModal
        manhwa={selectedManhwa}
        onClose={() => setSelectedManhwa(null)}
      />
    </div>
  );
}
