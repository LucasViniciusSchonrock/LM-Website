'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SlidersHorizontal, Youtube } from 'lucide-react';

export default function Navbar() {
  const [isLocal, setIsLocal] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        setIsLocal(true);
      }

      const handleScroll = () => {
        setScrolled(window.scrollY > 30);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-10 py-4 ${
        scrolled
          ? 'bg-[#0B0B0E]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-lg shadow-black/40'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Oficial Luke Manhwa (Totalmente sem fundo / transparente) */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="Luke Manhwa"
              width={44}
              height={44}
              priority
              className="w-full h-full object-contain drop-shadow"
            />
          </div>
          <span className="font-black text-xl tracking-[0.16em] text-white uppercase select-none group-hover:text-purple-300 transition-colors">
            LUKE MANHWA
          </span>
        </Link>

        {/* Links Centrais de Navegação entre Seções */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-semibold">
          <a
            href="#catalogo"
            className="px-4 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-all"
          >
            Obras do Canal
          </a>
          <a
            href="#inscritos"
            className="px-4 py-1.5 rounded-full text-purple-300 hover:text-purple-100 hover:bg-purple-600/30 transition-all flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Recomendações dos Inscritos</span>
          </a>
        </nav>

        {/* Botões do Topo Estilo Roblox (como o botão 'Entrar' do Roblox) */}
        <div className="flex items-center gap-3">
          {/* Botão Admin (Visível apenas em localhost) */}
          {isLocal && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600/90 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-950/40 transition-all active:scale-95"
              title="Painel de Administração Local"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          )}

          {/* Botão Discord Comunidade */}
          <a
            href="https://discord.gg/arWFjTdbhT"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/35 text-[#d8dbff] hover:text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-[#5865F2]/40 transition-all shadow-md active:scale-95 group/discord"
            title="Entrar na Comunidade do Discord"
          >
            <svg
              className="w-4 h-4 fill-current text-[#7289da] group-hover/discord:text-white transition-colors"
              viewBox="0 0 24 24"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            <span>Discord</span>
          </a>

          {/* Botão Canal Principal */}
          <a
            href="https://www.youtube.com/@lukezinhorecap"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/15 transition-all shadow-md active:scale-95"
            title="Canal Principal Luke Manhwa (@lukezinhorecap)"
          >
            <Youtube className="w-4 h-4 text-red-500 fill-current" />
            <span>Canal Principal</span>
          </a>

          {/* Botão Canal Secundário (@manhwaluke) */}
          <a
            href="https://www.youtube.com/@manhwaluke"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-red-600/15 hover:bg-red-600/25 text-red-200 hover:text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-red-500/25 transition-all shadow-md active:scale-95"
            title="Canal Secundário (@manhwaluke)"
          >
            <Youtube className="w-4 h-4 text-red-400" />
            <span>Canal 2</span>
          </a>
        </div>
      </div>
    </header>
  );
}
