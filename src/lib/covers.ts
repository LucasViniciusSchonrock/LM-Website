/**
 * Retorna uma URL segura para exibir no navegador sem ser bloqueada por CORS,
 * referrers ou extensões de adblock.
 * Função pura e compatível tanto com o cliente (navegador) quanto com o servidor.
 */
export function getSafeCoverUrl(url?: string): string {
  if (!url) {
    return 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80';
  }

  // Se já for imagem local ou rota proxy, retorna direto
  if (url.startsWith('/') || url.startsWith('/covers') || url.startsWith('/api/cover')) {
    return url;
  }

  // Se for do MangaDex ou outra URL externa, passa pelo proxy interno para evitar bloqueios de adblock/referrer
  if (url.includes('mangadex.org')) {
    return `/api/cover?url=${encodeURIComponent(url)}`;
  }

  return url;
}
