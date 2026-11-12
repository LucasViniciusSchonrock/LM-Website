import fs from 'fs';
import path from 'path';

/**
 * Baixa uma capa remota e salva localmente em public/covers/{id}.jpg
 * para que o site na Vercel tenha as imagens embutidas com máxima velocidade
 * e independência total da API do MangaDex.
 * EXCLUSIVO PARA O SERVIDOR NODE.
 */
export async function downloadAndSaveCover(remoteUrl: string, id: string): Promise<string> {
  try {
    const publicCoversDir = path.join(process.cwd(), 'public', 'covers');
    if (!fs.existsSync(publicCoversDir)) {
      fs.mkdirSync(publicCoversDir, { recursive: true });
    }

    // Se for URL proxy interna (/api/cover?url=...), extrai a url real
    let targetUrl = remoteUrl;
    if (remoteUrl.includes('/api/cover?url=')) {
      const parts = remoteUrl.split('/api/cover?url=');
      targetUrl = decodeURIComponent(parts[1] || remoteUrl);
    }

    // Se já é arquivo local
    if (targetUrl.startsWith('/covers/')) {
      return targetUrl;
    }

    const sanitizedId = id.replace(/[^a-zA-Z0-9_-]/g, '_');
    const ext = targetUrl.includes('.png') ? 'png' : targetUrl.includes('.webp') ? 'webp' : 'jpg';
    const localFileName = `${sanitizedId}.${ext}`;
    const localFilePath = path.join(publicCoversDir, localFileName);

    let res = await fetch(targetUrl);

    // Se der erro no .512.jpg, tenta a imagem completa sem ele
    if (!res.ok && targetUrl.endsWith('.512.jpg')) {
      const rawUrl = targetUrl.replace('.512.jpg', '');
      res = await fetch(rawUrl);
    }

    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(localFilePath, buffer);
      return `/covers/${localFileName}`;
    } else {
      console.warn(`Não foi possível baixar a capa de ${targetUrl}: HTTP ${res.status}`);
      return `/api/cover?url=${encodeURIComponent(targetUrl)}`;
    }
  } catch (error) {
    console.error('Erro ao baixar capa localmente:', error);
    return remoteUrl;
  }
}

