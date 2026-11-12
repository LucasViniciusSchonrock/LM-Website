import Navbar from '@/components/Navbar';
import CatalogView from '@/components/CatalogView';
import { getLocalManhwas } from '@/lib/manhwas';

export const revalidate = 60; // ISR para Vercel: regenera se houver mudanças

export default function HomePage() {
  const manhwas = getLocalManhwas();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-10">
        <CatalogView initialManhwas={manhwas} />
      </main>

      {/* Footer Estilo Apple Minimalista */}
      <footer className="border-t border-white/[0.08] py-8 px-4 text-center text-xs text-zinc-500 ios-glass mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300">Luke Manhwa</span>
            <span>•</span>
            <span>Obras & Recomendações</span>
          </div>

          <p className="text-zinc-500">
            Interface inspirada no ecossistema iOS. Dados e capas sincronizados via API pública MangaDex.
          </p>

          <p className="text-zinc-500 text-[11px]">
            © {new Date().getFullYear()} Luke Manhwa. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

