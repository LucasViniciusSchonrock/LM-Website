'use client';

import React, { useState, useMemo } from 'react';
import { Search, Crown, Star, Users, RefreshCw, BookOpen } from 'lucide-react';
import { SubscriberRecommendation } from '@/types/manhwa';
import SubscriberCard from './SubscriberCard';
import SubscriberModal from './SubscriberModal';
import ScrollReveal from './ScrollReveal';

interface SubscriberRecommendationsViewProps {
  initialRecommendations: SubscriberRecommendation[];
}

export default function SubscriberRecommendationsView({
  initialRecommendations,
}: SubscriberRecommendationsViewProps) {
  const [recommendations, setRecommendations] = useState<SubscriberRecommendation[]>(initialRecommendations);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'members' | 'most_voted'>('all');
  const [selectedRec, setSelectedRec] = useState<SubscriberRecommendation | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Recarregar dados em tempo real do OBS HUB
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/subscribers-recommendations');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setRecommendations(data.data);
      }
    } catch (err) {
      console.error('Erro ao atualizar recomendações:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Filtragem e ordenação
  const filtered = useMemo(() => {
    let list = [...recommendations];

    // Busca por texto (título, quem sugeriu ou gênero)
    const query = searchTerm.toLowerCase().trim();
    if (query) {
      list = list.filter((r) => {
        const titleMatch = r.title.toLowerCase().includes(query);
        const userMatch = (r.suggestedBy || '').toLowerCase().includes(query);
        const genreMatch = (r.genre || '').toLowerCase().includes(query);
        return titleMatch || userMatch || genreMatch;
      });
    }

    // Filtros de categoria
    if (selectedFilter === 'members') {
      list = list.filter((r) => r.isMember || r.hasMemberSupport);
    } else if (selectedFilter === 'most_voted') {
      list = list.sort((a, b) => {
        const scoreA = (a.points || a.count || 1);
        const scoreB = (b.points || b.count || 1);
        return scoreB - scoreA;
      });
    }

    return list;
  }, [recommendations, searchTerm, selectedFilter]);

  return (
    <section id="inscritos" className="scroll-mt-24 space-y-6 sm:space-y-8">
      {/* Cabeçalho da Seção com Animação Scroll Reveal */}
      <ScrollReveal direction="up">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-950/40 via-[#141418] to-indigo-950/30 border border-purple-500/20 shadow-2xl shadow-purple-950/30">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-purple-600/30 text-purple-300 border border-purple-500/30">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>COMUNIDADE & LIVES</span>
              </span>
              <span className="text-xs text-zinc-400">
                Sincronizado com LM Stream [OBS HUB]
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Recomendações dos Inscritos
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-2xl leading-relaxed">
              Obras sugeridas diretamente pelo chat durante as lives e pelos membros do canal. Encontre joias raras indicadas pela comunidade!
            </p>
          </div>

          {/* Botão de Atualizar / Contador / Discord */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-end">
            <a
              href="https://discord.gg/arWFjTdbhT"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/35 text-[#d8dbff] hover:text-white text-xs font-semibold backdrop-blur-md border border-[#5865F2]/40 transition-all active:scale-95 group/discord"
              title="Entrar na comunidade do Discord"
            >
              <svg className="w-3.5 h-3.5 fill-current text-[#7289da] group-hover/discord:text-white transition-colors" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              <span>Discord</span>
            </a>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 text-xs font-semibold backdrop-blur-md border border-white/10 transition-all active:scale-95 disabled:opacity-50"
              title="Sincronizar com LM Stream"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-purple-400' : ''}`} />
              <span>{refreshing ? 'Atualizando...' : 'Sincronizar'}</span>
            </button>

            <span className="px-3.5 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
              {recommendations.length} obras
            </span>
          </div>
        </div>
      </ScrollReveal>

      {/* Barra de Busca & Filtros dos Inscritos com Scroll Reveal */}
      <ScrollReveal direction="up" delay={70}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Input de Busca */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por obra, inscrito ou gênero..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-[#141418] border border-white/10 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500/80 transition-all shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] text-zinc-400 hover:text-white rounded-full bg-white/10"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Botões Segmentados */}
          <div className="inline-flex p-1 rounded-2xl bg-[#141418] border border-white/10 shadow-lg shrink-0">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Todas ({recommendations.length})
            </button>
            <button
              onClick={() => setSelectedFilter('members')}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedFilter === 'members'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>Membros</span>
            </button>
            <button
              onClick={() => setSelectedFilter('most_voted')}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedFilter === 'most_voted'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-300" />
              <span>Mais Votadas</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Grid de Cards dos Inscritos com Animação Scroll Reveal Stagger */}
      {filtered.length === 0 ? (
        <ScrollReveal direction="up">
          <div className="py-16 text-center rounded-3xl bg-[#141418]/60 border border-white/10 space-y-3">
            <BookOpen className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-base font-semibold text-zinc-300">
              Nenhuma recomendação encontrada
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Tente buscar por outro termo ou mude o filtro selecionado.
            </p>
          </div>
        </ScrollReveal>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5">
          {filtered.map((rec, index) => (
            <ScrollReveal
              key={rec.id}
              delay={(index % 6) * 50}
              direction="up"
            >
              <SubscriberCard
                recommendation={rec}
                onSelect={setSelectedRec}
              />
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* Modal de Detalhes da Recomendação */}
      <SubscriberModal
        recommendation={selectedRec}
        onClose={() => setSelectedRec(null)}
      />
    </section>
  );
}
