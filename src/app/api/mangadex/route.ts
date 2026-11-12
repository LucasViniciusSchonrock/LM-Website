import { NextRequest, NextResponse } from 'next/server';
import { parseMgekoUrl } from '@/lib/scrapers/mgeko';

// Função auxiliar para traduzir texto automaticamente para Português
async function translateToPortuguese(text: string): Promise<string> {
  if (!text || text.trim().length === 0) return 'Sem sinopse disponível.';

  try {
    const cleanText = text.replace(/\[\/?(b|i|u|url|spoiler)\]/gi, '').trim().slice(0, 1500);
    const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=pt&dt=t&q=${encodeURIComponent(cleanText)}`;

    const res = await fetch(translateUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      next: { revalidate: 86400 },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0].map((chunk: any) => chunk[0]).join('');
        if (translated && translated.trim().length > 0) {
          return translated.trim();
        }
      }
    }
  } catch (err) {
    console.warn('Falha na tradução automática da sinopse:', err);
  }

  return text;
}

// Formata os dados de um item retornado da API do MangaDex
async function formatMangaItem(manga: any) {
  const attrs = manga.attributes || {};
  const relationships = manga.relationships || [];

  // 1. TÍTULO EM INGLÊS PRIORITÁRIO
  const titleEn =
    attrs.title?.en ||
    attrs.altTitles?.find((t: any) => t.en)?.en ||
    attrs.title?.['ko-ro'] ||
    attrs.title?.['ja-ro'] ||
    attrs.title?.['pt-br'] ||
    Object.values(attrs.title || {})[0] ||
    'Sem título';

  // Título original (Hangul, Hanzi ou Kanji)
  const originalTitle =
    attrs.altTitles?.find((t: any) => t.ko)?.ko ||
    attrs.altTitles?.find((t: any) => t.zh)?.zh ||
    attrs.altTitles?.find((t: any) => t.ja)?.ja ||
    attrs.title?.ko ||
    attrs.title?.zh ||
    attrs.title?.ja ||
    '';

  // Nomes alternativos
  const altTitles: string[] = (attrs.altTitles || [])
    .map((t: any) => Object.values(t)[0] as string)
    .filter(Boolean)
    .slice(0, 5);

  // 2. SINOPSE EM PORTUGUÊS GARANTIDA
  let synopsis =
    attrs.description?.['pt-br'] ||
    attrs.description?.['pt'];

  if (!synopsis) {
    const rawEnglish =
      attrs.description?.en ||
      attrs.description?.es ||
      Object.values(attrs.description || {})[0] as string;

    if (rawEnglish) {
      synopsis = await translateToPortuguese(rawEnglish);
    } else {
      synopsis = 'Sem sinopse disponível.';
    }
  }

  // Capa oficial do MangaDex
  const coverRel = relationships.find((r: any) => r.type === 'cover_art');
  const coverFileName = coverRel?.attributes?.fileName;

  let rawCoverUrl = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80';
  if (coverFileName) {
    rawCoverUrl = `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}.512.jpg`;
  }

  const safeCoverUrl = `/api/cover?url=${encodeURIComponent(rawCoverUrl)}`;

  // Autor & Artista
  const authorRel = relationships.find((r: any) => r.type === 'author');
  const artistRel = relationships.find((r: any) => r.type === 'artist');
  const author = authorRel?.attributes?.name || '';
  const artist = artistRel?.attributes?.name || author;

  // Tags / Gêneros
  const genres = (attrs.tags || [])
    .map((tag: any) => tag.attributes?.name?.en)
    .filter(Boolean)
    .slice(0, 6);

  // Status
  const statusMap: Record<string, string> = {
    ongoing: 'ongoing',
    completed: 'completed',
    hiatus: 'hiatus',
    cancelled: 'cancelled',
  };
  const status = statusMap[attrs.status] || 'ongoing';

  return {
    mangadexId: manga.id,
    title: titleEn,
    originalTitle,
    alternativeTitles: altTitles,
    coverUrl: safeCoverUrl,
    rawCoverUrl,
    synopsis,
    status,
    releaseYear: attrs.year || new Date().getFullYear(),
    author,
    artist,
    genres,
    mangadexUrl: `https://mangadex.org/title/${manga.id}`,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ results: [] });
  }

  const cleanQuery = query.trim();

  // 1. SUPORTE A URL DO MGEKO (ex: https://www.mgeko.cc/manga/qt04-goblin-corporation/)
  if (cleanQuery.includes('mgeko.cc') || cleanQuery.includes('manga/qt')) {
    try {
      const mgekoData = await parseMgekoUrl(cleanQuery);
      const ptSynopsis = await translateToPortuguese(mgekoData.rawSynopsis);

      const safeCoverUrl = mgekoData.rawCoverUrl
        ? `/api/cover?url=${encodeURIComponent(mgekoData.rawCoverUrl)}`
        : 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80';

      return NextResponse.json({
        results: [
          {
            mangadexId: mgekoData.mangadexId,
            title: mgekoData.title,
            originalTitle: mgekoData.originalTitle,
            alternativeTitles: mgekoData.alternativeTitles,
            coverUrl: safeCoverUrl,
            rawCoverUrl: mgekoData.rawCoverUrl,
            synopsis: ptSynopsis,
            status: mgekoData.status,
            releaseYear: mgekoData.releaseYear,
            author: mgekoData.author,
            artist: mgekoData.artist,
            genres: mgekoData.genres,
            mangadexUrl: mgekoData.mangadexUrl,
            readingUrl: mgekoData.readingUrl,
          },
        ],
      });
    } catch (err: any) {
      console.error('Falha ao obter dados do Mgeko:', err);
      return NextResponse.json(
        { error: 'Não foi possível extrair os dados da URL do Mgeko.', details: err.message },
        { status: 500 }
      );
    }
  }

  // 2. BUSCA POR URL OU ID DIRETO DO MANGADEX
  const uuidMatch = cleanQuery.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);

  try {
    if (uuidMatch && uuidMatch[0]) {
      const mangaId = uuidMatch[0];
      const url = `https://api.mangadex.org/manga/${mangaId}?includes[]=cover_art&includes[]=author&includes[]=artist`;

      const res = await fetch(url, {
        headers: {
          'User-Agent': 'LukeManhwaWebsite/1.0',
        },
        next: { revalidate: 60 },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          const formatted = await formatMangaItem(data.data);
          return NextResponse.json({ results: [formatted] });
        }
      }
    }

    // 3. BUSCA POR TÍTULO (TEXTUAL) NO MANGADEX
    const url = new URL('https://api.mangadex.org/manga');
    url.searchParams.append('title', cleanQuery);
    url.searchParams.append('limit', '15');
    url.searchParams.append('includes[]', 'cover_art');
    url.searchParams.append('includes[]', 'author');
    url.searchParams.append('includes[]', 'artist');
    url.searchParams.append('contentRating[]', 'safe');
    url.searchParams.append('contentRating[]', 'suggestive');
    url.searchParams.append('order[relevance]', 'desc');

    const res = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'LukeManhwaWebsite/1.0',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`MangaDex API respondeu com status ${res.status}`);
    }

    const data = await res.json();
    const mangas = data.data || [];

    const formattedResults = await Promise.all(
      mangas.map(async (manga: any) => formatMangaItem(manga))
    );

    return NextResponse.json({ results: formattedResults });
  } catch (error: any) {
    console.error('Erro ao consultar MangaDex:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar obras no MangaDex', details: error.message },
      { status: 500 }
    );
  }
}
