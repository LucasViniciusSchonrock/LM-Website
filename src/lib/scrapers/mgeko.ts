// Parser especializado para URLs do Mgeko (mgeko.cc)

export async function parseMgekoUrl(url: string) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!res.ok) {
      throw new Error(`Mgeko respondeu com status ${res.status}`);
    }

    const html = await res.text();

    // 1. TÍTULO
    let title = '';
    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    if (h1Match) {
      title = h1Match[1].replace(/\[.*?\]/g, '').trim();
    }
    if (!title) {
      const metaTitle = html.match(/property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
      title = metaTitle ? metaTitle[1].replace(/\[.*?\]/g, '').trim() : 'Obra Mgeko';
    }

    // 2. CAPA
    let rawCoverUrl = '';
    const ogImage = html.match(/property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    if (ogImage && ogImage[1]) {
      rawCoverUrl = ogImage[1].trim();
      if (rawCoverUrl.startsWith('/')) {
        rawCoverUrl = `https://www.mgeko.cc${rawCoverUrl}`;
      }
    }

    // 3. SINOPSE
    let rawSynopsis = '';
    const summaryIdx = html.indexOf('Summary is');
    if (summaryIdx !== -1) {
      const part = html.substring(summaryIdx + 10, summaryIdx + 2000);
      const endIdx = part.indexOf('</p>');
      if (endIdx !== -1) {
        rawSynopsis = part
          .substring(0, endIdx)
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<[^>]+>/g, '')
          .replace(/\*\*.*?\*\*/g, '')
          .replace(/\[.*?\]\(.*?\)/g, '')
          .trim();
      }
    }
    if (!rawSynopsis) {
      const metaDesc = html.match(/name=["']description["'][^>]+content=["']([^"']+)["']/i);
      rawSynopsis = metaDesc ? metaDesc[1].trim() : 'Sem sinopse disponível.';
    }

    // 4. GÊNEROS
    const genres: string[] = [];
    const genreRegex = /genre_included=\s*([^&"']+)/gi;
    let gm;
    while ((gm = genreRegex.exec(html)) !== null) {
      const g = decodeURIComponent(gm[1]).trim();
      if (g && !genres.includes(g)) {
        genres.push(g);
      }
    }
    if (genres.length === 0) {
      genres.push('Ação', 'Fantasia');
    }

    // 5. AUTOR
    let author = '';
    const authorMatch = html.match(/written by\s+([^,.\n]+(?:,\s*[^,.\n]+)?)/i);
    if (authorMatch) {
      author = authorMatch[1].replace(/and is.*/i, '').trim();
    }

    // 6. STATUS
    const status = html.toLowerCase().includes('status: completed') ? 'completed' : 'ongoing';

    // Cria ID único limpo baseado na URL
    const slugMatch = url.match(/\/manga\/([^\/]+)/);
    const slug = slugMatch ? slugMatch[1] : `mgeko-${Date.now()}`;

    return {
      mangadexId: `mgeko-${slug}`,
      title,
      originalTitle: '',
      alternativeTitles: [],
      rawCoverUrl,
      rawSynopsis,
      status: status as 'ongoing' | 'completed',
      releaseYear: new Date().getFullYear(),
      author: author || 'Autor Desconhecido',
      artist: author || '',
      genres: genres.slice(0, 6),
      readingUrl: url,
      mangadexUrl: url,
    };
  } catch (error: any) {
    console.error('Erro ao processar URL do Mgeko:', error);
    throw error;
  }
}

