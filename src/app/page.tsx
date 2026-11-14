import Navbar from '@/components/Navbar';
import VideoHero from '@/components/VideoHero';
import CatalogView from '@/components/CatalogView';
import SubscriberRecommendationsView from '@/components/SubscriberRecommendationsView';
import { getLocalManhwas } from '@/lib/manhwas';
import { getSubscriberRecommendations } from '@/lib/subscriber-recommendations';

export const revalidate = 60; // ISR para Vercel: regenera se houver mudanças

export default function HomePage() {
  const manhwas = getLocalManhwas();
  const subscriberRecs = getSubscriberRecommendations();

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0B0E]">
      <Navbar />

      {/* Hero Cinematográfico com Thumbnails do Canal (Estilo Roblox) */}
      <VideoHero manhwas={manhwas} />

      {/* Conteúdo Principal do Site */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-14 space-y-16 sm:space-y-24">
        {/* 1. Catálogo Oficial: Obras do Canal Luke Manhwa */}
        <div id="catalogo" className="scroll-mt-24">
          <CatalogView initialManhwas={manhwas} />
        </div>

        {/* 2. Nova Seção: Obras Recomendadas pelos Inscritos (LM Stream OBS HUB) */}
        <SubscriberRecommendationsView initialRecommendations={subscriberRecs} />
      </main>

      {/* Footer Minimalista */}
      <footer className="border-t border-white/[0.08] py-8 px-4 text-center text-xs text-zinc-500 ios-glass mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300">Luke Manhwa</span>
            <span>•</span>
            <span>Obras & Recomendações</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.youtube.com/@lukezinhorecap"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-red-400 transition-colors font-medium"
            >
              Canal Principal
            </a>
            <span>•</span>
            <a
              href="https://www.youtube.com/@manhwaluke"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-red-400 transition-colors font-medium"
            >
              Canal Secundário
            </a>
            <span>•</span>
            <a
              href="https://discord.gg/arWFjTdbhT"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-[#7289da] transition-colors font-medium"
            >
              Comunidade Discord
            </a>
          </div>

          <p className="text-zinc-500 text-[11px]">
            © {new Date().getFullYear()} Luke Manhwa. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
