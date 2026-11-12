'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, SlidersHorizontal, Youtube } from 'lucide-react';

export default function Navbar() {
  const [isLocal, setIsLocal] = useState(false);

  useEffect(() => {
    // Detecta se está acessando via localhost
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        setIsLocal(true);
      }
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3.5 ios-glass border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Marca */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-purple-950/40 border border-purple-500/30 shadow-lg shadow-purple-600/25 group-hover:scale-105 group-hover:border-purple-400/60 transition-all">
            <Image
              src="/logo.png"
              alt="Luke Manhwa"
              width={40}
              height={40}
              priority
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-lg tracking-tight text-white group-hover:text-purple-300 transition-colors">
                Luke Manhwa
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Obras
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Catálogo & Recomendações</p>
          </div>
        </Link>

        {/* Links & Ações Estilo iOS */}
        <div className="flex items-center gap-2.5">
          {/* Link para o canal */}
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-200 transition-all ios-btn"
          >
            <Youtube className="w-3.5 h-3.5 text-red-400" />
            <span>Canal do Luke</span>
          </a>

          {/* Botão Admin (Visível APENAS no Localhost) */}
          {isLocal && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all ios-btn"
              title="Acessar painel de administração (apenas em localhost)"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Admin Local</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

