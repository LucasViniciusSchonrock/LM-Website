'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Flame,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  Save,
  X,
  Layers,
  Download,
  AlertCircle,
  RefreshCw,
  Youtube,
  Play
} from 'lucide-react';
import { Manhwa, ManhwaStatus } from '@/types/manhwa';
import { getSafeCoverUrl } from '@/lib/covers';
import { getYouTubeEmbedUrl } from '@/lib/video';

interface AdminPanelProps {
  initialManhwas: Manhwa[];
}

export default function AdminPanel({ initialManhwas }: AdminPanelProps) {
  const [manhwas, setManhwas] = useState<Manhwa[]>(initialManhwas);
  const [activeTab, setActiveTab] = useState<'catalog' | 'mangadex' | 'new'>('mangadex');

  // Busca no catálogo local
  const [localSearch, setLocalSearch] = useState('');

  // Busca no MangaDex
  const [mdQuery, setMdQuery] = useState('');
  const [mdLoading, setMdLoading] = useState(false);
  const [mdResults, setMdResults] = useState<any[]>([]);
  const [mdError, setMdError] = useState('');

  // Formulário de Edição / Criação
  const [editingManhwa, setEditingManhwa] = useState<Partial<Manhwa> | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Recarrega lista mais recente do servidor local
  const refreshCatalog = async () => {
    try {
      const res = await fetch('/api/admin/manhwas');
      if (res.ok) {
        const data = await res.json();
        setManhwas(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshCatalog();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Buscar no MangaDex
  const handleSearchMangaDex = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!mdQuery.trim()) return;

    setMdLoading(true);
    setMdError('');
    try {
      const res = await fetch(`/api/mangadex?q=${encodeURIComponent(mdQuery.trim())}`);
      const data = await res.json();
      if (res.ok) {
        setMdResults(data.results || []);
        if (data.results?.length === 0) {
          setMdError('Nenhuma obra encontrada no MangaDex com esse nome.');
        }
      } else {
        setMdError(data.error || 'Erro ao consultar MangaDex.');
      }
    } catch (err: any) {
      setMdError('Falha na conexão com a API.');
    } finally {
      setMdLoading(false);
    }
  };

  // Preencher formulário a partir de resultado do MangaDex
  const handleSelectFromMangaDex = (mdItem: any) => {
    setEditingManhwa({
      id: `md-${mdItem.mangadexId}`,
      mangadexId: mdItem.mangadexId,
      title: mdItem.title,
      originalTitle: mdItem.originalTitle || '',
      alternativeTitles: mdItem.alternativeTitles || [],
      coverUrl: mdItem.rawCoverUrl || mdItem.coverUrl,
      synopsis: mdItem.synopsis || '',
      status: mdItem.status || 'ongoing',
      releaseYear: mdItem.releaseYear || new Date().getFullYear(),
      author: mdItem.author || '',
      artist: mdItem.artist || '',
      genres: mdItem.genres || ['Ação', 'Fantasia'],
      rating: 9.0,
      totalChapters: '',
      isFeatured: false,
      lukeRecommended: true,
      lukeReview: '',
      lukeVideoUrl: '',
      mangadexUrl: mdItem.mangadexUrl || '',
    });
    setActiveTab('new');
  };

  // Salvar no servidor local (data/manhwas.json e public/covers/)
  const handleSaveManhwa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingManhwa?.title || !editingManhwa?.coverUrl) {
      alert('Por favor, preencha o título e a URL da capa.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/manhwas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingManhwa),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro ao salvar.');
      }

      const resData = await res.json();
      const savedItem = resData.manhwa || editingManhwa;

      // Atualiza lista local
      setManhwas((prev) => {
        const exists = prev.some((m) => m.id === savedItem.id);
        if (exists) {
          return prev.map((m) => (m.id === savedItem.id ? savedItem : m));
        }
        return [savedItem, ...prev];
      });

      showToast(`Obra "${savedItem.title}" salva com sucesso! (Capa armazenada localmente)`);
      setEditingManhwa(null);
      setActiveTab('catalog');
    } catch (err: any) {
      alert(err.message || 'Falha ao salvar a obra.');
    } finally {
      setSaving(false);
    }
  };

  // Deletar obra
  const handleDeleteManhwa = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${title}" do catálogo?`)) return;

    try {
      const res = await fetch(`/api/admin/manhwas?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Falha ao remover a obra.');
      }

      setManhwas((prev) => prev.filter((m) => m.id !== id));
      showToast(`Obra "${title}" removida do catálogo.`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredCatalog = manhwas.filter((m) => {
    const q = localSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      m.title.toLowerCase().includes(q) ||
      (m.originalTitle && m.originalTitle.toLowerCase().includes(q)) ||
      (m.author && m.author.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen pb-16">
      {/* Header Admin estilo Apple */}
      <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3.5 ios-glass border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white border border-white/10 transition-all ios-btn"
              title="Voltar ao site público"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-purple-950/40 border border-purple-500/30 shadow-md shadow-purple-600/20 hidden sm:block">
              <Image
                src="/logo.png"
                alt="Luke Manhwa"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Painel Admin • Luke Manhwa
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Localhost Ativo
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Gerencie obras, sincronize com MangaDex e salve localmente
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshCatalog}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 transition-all"
              title="Recarregar dados do disco"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Atualizar</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 transition-all ios-btn"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Site Público</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Toast Notification estilo iOS */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-purple-600 text-white font-medium text-xs sm:text-sm shadow-xl shadow-purple-900/40 border border-white/20 animate-in slide-in-from-bottom-5">
          {toastMessage}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Métricas Rápidas Estilo Widgets iOS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl ios-glass border border-white/10">
            <p className="text-xs text-zinc-400">Total de Obras</p>
            <p className="text-2xl font-bold text-white mt-1">{manhwas.length}</p>
          </div>
          <div className="p-4 rounded-2xl ios-glass border border-white/10">
            <p className="text-xs text-zinc-400">Recomendadas (Luke)</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">
              {manhwas.filter((m) => m.lukeRecommended).length}
            </p>
          </div>
          <div className="p-4 rounded-2xl ios-glass border border-white/10">
            <p className="text-xs text-zinc-400">Em Lançamento</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              {manhwas.filter((m) => m.status === 'ongoing').length}
            </p>
          </div>
          <div className="p-4 rounded-2xl ios-glass border border-white/10">
            <p className="text-xs text-zinc-400">Finalizadas</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {manhwas.filter((m) => m.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Abas Superiores Estilo Segmented Controls iOS */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 rounded-2xl bg-[#141418] border border-white/10 shadow-lg">
            <button
              onClick={() => setActiveTab('mangadex')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'mangadex'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Importar Obra (MangaDex / Mgeko)</span>
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'catalog'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Catálogo Atual ({manhwas.length})</span>
            </button>
            <button
              onClick={() => {
                setEditingManhwa({
                  id: '',
                  title: '',
                  originalTitle: '',
                  coverUrl: '',
                  synopsis: '',
                  status: 'ongoing',
                  releaseYear: new Date().getFullYear(),
                  genres: ['Ação', 'Fantasia'],
                  rating: 9.0,
                  lukeRecommended: true,
                });
                setActiveTab('new');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'new'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Manualmente</span>
            </button>
          </div>
        </div>

        {/* ABA 1: IMPORTAR DO MANGADEX */}
        {activeTab === 'mangadex' && (
          <div className="space-y-6">
            <div className="max-w-xl mx-auto space-y-3">
              <form onSubmit={handleSearchMangaDex} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={mdQuery}
                    onChange={(e) => setMdQuery(e.target.value)}
                    placeholder="Cole o link do MangaDex ou Mgeko (mgeko.cc) ou digite o nome..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#141418] border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={mdLoading}
                  className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all ios-btn disabled:opacity-50 shrink-0"
                >
                  {mdLoading ? 'Buscando...' : 'Buscar Obra'}
                </button>
              </form>

              <p className="text-[11px] text-zinc-400 text-center">
                Pesquise por nome ou <b>cole a URL direta</b> do <b>MangaDex</b> ou do <b>Mgeko (mgeko.cc)</b>. Puxamos o título oficial em inglês, capa em HD e sinopse em português!
              </p>
            </div>

            {mdError && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2 max-w-xl mx-auto">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{mdError}</span>
              </div>
            )}

            {/* Resultados MangaDex */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mdResults.map((mdItem) => {
                const alreadyExists = manhwas.some((m) => m.mangadexId === mdItem.mangadexId);
                const safePreviewUrl = getSafeCoverUrl(mdItem.coverUrl);

                return (
                  <div
                    key={mdItem.mangadexId}
                    className="p-4 rounded-[22px] ios-glass-card flex gap-4 items-start"
                  >
                    <div className="relative w-24 aspect-[3/4.2] rounded-xl overflow-hidden shrink-0 bg-zinc-900 border border-white/10">
                      <img
                        src={safePreviewUrl}
                        alt={mdItem.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes('/api/cover')) {
                            target.src = `/api/cover?url=${encodeURIComponent(mdItem.rawCoverUrl || mdItem.coverUrl)}`;
                          }
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                            {mdItem.status}
                          </span>
                          {mdItem.releaseYear && (
                            <span className="text-[10px] text-zinc-400">
                              {mdItem.releaseYear}
                            </span>
                          )}
                        </div>

                        <h3 className="font-semibold text-sm text-white line-clamp-1 mt-1">
                          {mdItem.title}
                        </h3>
                        {mdItem.originalTitle && (
                          <p className="text-[11px] text-zinc-400 line-clamp-1">
                            {mdItem.originalTitle}
                          </p>
                        )}

                        <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
                          {mdItem.synopsis}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                        {alreadyExists ? (
                          <span className="text-[11px] text-purple-400 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Já no catálogo
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSelectFromMangaDex(mdItem)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all ios-btn"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Importar Obra</span>
                          </button>
                        )}

                        <a
                          href={mdItem.mangadexUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-500 hover:text-zinc-300 text-[11px]"
                          title="Abrir no MangaDex"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ABA 2: CATÁLOGO ATUAL */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Filtrar catálogo cadastrado..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#141418] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                onClick={() => setActiveTab('mangadex')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all ios-btn"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Puxar Novas Obras do MangaDex</span>
              </button>
            </div>

            {filteredCatalog.length === 0 ? (
              <div className="py-16 text-center rounded-[28px] ios-glass border border-white/10 space-y-3">
                <p className="text-zinc-400 text-sm">O catálogo está vazio no momento.</p>
                <button
                  onClick={() => setActiveTab('mangadex')}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
                >
                  Pesquisar Obras no MangaDex
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCatalog.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-[22px] ios-glass-card flex gap-3.5 items-start justify-between group"
                  >
                    <div className="relative w-20 h-28 rounded-xl overflow-hidden shrink-0 bg-zinc-900 border border-white/10">
                      <img
                        src={getSafeCoverUrl(item.coverUrl)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.lukeRecommended && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-600/30 text-purple-300 font-bold border border-purple-500/30">
                            Top Luke
                          </span>
                        )}
                        {item.isFeatured && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                            Hero
                          </span>
                        )}
                        {item.lukeVideoUrl && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-600/20 text-red-300 font-semibold border border-red-500/30 flex items-center gap-1">
                            <Youtube className="w-3 h-3 text-red-400" />
                            Com Vídeo
                          </span>
                        )}
                        <span className="text-[10px] text-zinc-400">
                          {item.status === 'completed' ? 'Finalizado' : 'Em Lançamento'}
                        </span>
                      </div>

                      <h3 className="font-semibold text-sm text-white truncate mt-1">
                        {item.title}
                      </h3>
                      {item.originalTitle && (
                        <p className="text-[11px] text-zinc-400 truncate font-light">
                          {item.originalTitle}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-xs text-zinc-400 mt-2">
                        <span className="flex items-center gap-1 text-amber-300 font-medium">
                          <Star className="w-3 h-3 fill-amber-300" />
                          {item.rating || '-'}
                        </span>
                        <span>•</span>
                        <span>{item.genres[0] || 'Manhwa'}</span>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-white/5">
                        <button
                          onClick={() => {
                            setEditingManhwa(item);
                            setActiveTab('new');
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-zinc-300 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Editar</span>
                        </button>

                        <button
                          onClick={() => handleDeleteManhwa(item.id, item.title)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-[11px] text-red-300 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Excluir</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABA 3: ADICIONAR / EDITAR MANUALMENTE */}
        {activeTab === 'new' && editingManhwa && (
          <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-[28px] ios-glass border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {editingManhwa.id ? 'Personalizar & Salvar Obra' : 'Adicionar Nova Obra de Manhwa'}
                </h2>
                <p className="text-xs text-zinc-400">
                  Ao salvar, a capa será baixada e salva permanentemente no seu app local.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingManhwa(null);
                  setActiveTab('catalog');
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveManhwa} className="space-y-5">
              {/* Preview da Capa & Campos Básicos */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Preview Capa */}
                <div className="flex flex-col items-center">
                  <div className="relative w-36 aspect-[3/4.2] rounded-2xl overflow-hidden bg-zinc-900 border border-white/15 shadow-xl">
                    {editingManhwa.coverUrl ? (
                      <img
                        src={getSafeCoverUrl(editingManhwa.coverUrl)}
                        alt="Capa"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs text-center p-2">
                        Insira a URL da Capa
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-2">Preview da Capa</p>
                </div>

                {/* Campos Principais */}
                <div className="sm:col-span-2 space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Título Oficial da Obra *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingManhwa.title || ''}
                      onChange={(e) =>
                        setEditingManhwa((prev) => ({ ...prev, title: e.target.value }))
                      }
                      placeholder="Ex: Solo Leveling"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141418] border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Título Original (Hangul / Coreano)
                    </label>
                    <input
                      type="text"
                      value={editingManhwa.originalTitle || ''}
                      onChange={(e) =>
                        setEditingManhwa((prev) => ({ ...prev, originalTitle: e.target.value }))
                      }
                      placeholder="Ex: 나 혼자만 레벨업"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141418] border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      URL da Capa *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingManhwa.coverUrl || ''}
                      onChange={(e) =>
                        setEditingManhwa((prev) => ({ ...prev, coverUrl: e.target.value }))
                      }
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141418] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Grid de Metadados: Status, Nota, Ano, Capítulos */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Status
                  </label>
                  <select
                    value={editingManhwa.status || 'ongoing'}
                    onChange={(e) =>
                      setEditingManhwa((prev) => ({
                        ...prev,
                        status: e.target.value as ManhwaStatus,
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#141418] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="ongoing">Em Lançamento</option>
                    <option value="completed">Finalizado</option>
                    <option value="hiatus">Hiato</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Nota (0 a 10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={editingManhwa.rating || 9.5}
                    onChange={(e) =>
                      setEditingManhwa((prev) => ({
                        ...prev,
                        rating: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#141418] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Ano Lançamento
                  </label>
                  <input
                    type="text"
                    value={editingManhwa.releaseYear || ''}
                    onChange={(e) =>
                      setEditingManhwa((prev) => ({ ...prev, releaseYear: e.target.value }))
                    }
                    placeholder="2024"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#141418] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Total Capítulos
                  </label>
                  <input
                    type="text"
                    value={editingManhwa.totalChapters || ''}
                    onChange={(e) =>
                      setEditingManhwa((prev) => ({ ...prev, totalChapters: e.target.value }))
                    }
                    placeholder="Ex: 150+"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#141418] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Autor, Artista e Gêneros */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Autor / Escritor
                  </label>
                  <input
                    type="text"
                    value={editingManhwa.author || ''}
                    onChange={(e) =>
                      setEditingManhwa((prev) => ({ ...prev, author: e.target.value }))
                    }
                    placeholder="Ex: Chugong"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141418] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Gêneros (separados por vírgula)
                  </label>
                  <input
                    type="text"
                    value={(editingManhwa.genres || []).join(', ')}
                    onChange={(e) =>
                      setEditingManhwa((prev) => ({
                        ...prev,
                        genres: e.target.value
                          .split(',')
                          .map((g) => g.trim())
                          .filter(Boolean),
                      }))
                    }
                    placeholder="Ação, Fantasia, Murim..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141418] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Sinopse */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Sinopse
                </label>
                <textarea
                  rows={4}
                  value={editingManhwa.synopsis || ''}
                  onChange={(e) =>
                    setEditingManhwa((prev) => ({ ...prev, synopsis: e.target.value }))
                  }
                  placeholder="Resumo da história do manhwa..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141418] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* SEÇÃO ESPECIAL DO CANAL LUKE MANHWA */}
              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/25 space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                  <Flame className="w-4 h-4 text-amber-300" />
                  <span>Configurações Especiais do Canal Luke Manhwa</span>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-200">
                    <input
                      type="checkbox"
                      checked={!!editingManhwa.lukeRecommended}
                      onChange={(e) =>
                        setEditingManhwa((prev) => ({
                          ...prev,
                          lukeRecommended: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-zinc-900 border-white/20"
                    />
                    <span>Selo "Recomendado pelo Luke"</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-200">
                    <input
                      type="checkbox"
                      checked={!!editingManhwa.isFeatured}
                      onChange={(e) =>
                        setEditingManhwa((prev) => ({
                          ...prev,
                          isFeatured: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-zinc-900 border-white/20"
                    />
                    <span>Destaque Principal no Banner (Hero)</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Comentário / Resenha Pessoal do Luke
                  </label>
                  <input
                    type="text"
                    value={editingManhwa.lukeReview || ''}
                    onChange={(e) =>
                      setEditingManhwa((prev) => ({ ...prev, lukeReview: e.target.value }))
                    }
                    placeholder="Ex: Uma das melhores obras que li esse ano! Vale muito a pena conferir..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141418] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-zinc-300">
                      Link do Vídeo do Canal (YouTube)
                    </label>
                    {editingManhwa.lukeVideoUrl && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <Youtube className="w-3 h-3 text-red-500" />
                        Link detectado
                      </span>
                    )}
                  </div>
                  <input
                    type="url"
                    value={editingManhwa.lukeVideoUrl || ''}
                    onChange={(e) =>
                      setEditingManhwa((prev) => ({ ...prev, lukeVideoUrl: e.target.value }))
                    }
                    placeholder="Ex: https://www.youtube.com/watch?v=... ou https://youtu.be/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141418] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Cole o link do seu vídeo do YouTube ou Shorts. O vídeo ficará com um player embutido exclusivo na página da obra para os seus inscritos assistirem!
                  </p>

                  {/* Preview do Player de Vídeo em Tempo Real */}
                  {editingManhwa.lukeVideoUrl && getYouTubeEmbedUrl(editingManhwa.lukeVideoUrl) && (
                    <div className="mt-3 p-3 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                      <p className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5 text-red-400 fill-current" />
                        Preview do Player do Canal:
                      </p>
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
                        <iframe
                          src={getYouTubeEmbedUrl(editingManhwa.lukeVideoUrl)!}
                          title="Preview do Vídeo"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          referrerPolicy="strict-origin-when-cross-origin"
                          className="w-full h-full border-0"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Botões Salvar / Cancelar */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingManhwa(null);
                    setActiveTab('catalog');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-zinc-300 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all ios-btn disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Baixando capa e salvando...' : 'Salvar Obra no Catálogo'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
