import { headers } from 'next/headers';
import { isLocalhost, getLocalManhwas } from '@/lib/manhwas';
import AdminPanel from './AdminPanel';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AdminPage() {
  const reqHeaders = headers();
  const localAllowed = isLocalhost(reqHeaders);

  // Se estiver na Vercel ou não for localhost, bloqueia o acesso
  if (!localAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#0B0B0E] text-white">
        <div className="max-w-md w-full p-8 rounded-[28px] ios-glass border border-red-500/30 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Acesso Restrito ao Localhost
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            O Painel de Administração de Obras funciona exclusivamente em ambiente local (computador do Luke). Esta versão em nuvem (Vercel) é somente leitura para os visitantes.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold text-zinc-200 transition-all ios-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para o Catálogo</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const manhwas = getLocalManhwas();
  return <AdminPanel initialManhwas={manhwas} />;
}

