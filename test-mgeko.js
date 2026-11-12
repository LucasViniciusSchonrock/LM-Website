const fs = require('fs');

async function testMgeko() {
  const url = 'https://www.mgeko.cc/manga/qt04-goblin-corporation/';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
  });

  const html = await res.text();

  // Meta Tags
  const getMeta = (prop) => {
    const match = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`, 'i')) ||
                  html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`, 'i'));
    return match ? match[1] : null;
  };

  const ogTitle = getMeta('og:title') || getMeta('title');
  const ogImage = getMeta('og:image');
  const ogDesc = getMeta('og:description') || getMeta('description');

  // Alternativos: h1, sinopse detalhada na div
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  
  // Imagem da capa (muitas vezes na classe main-cover ou manga-poster)
  const coverMatch = html.match(/class=["'][^"']*(?:poster|cover|thumb)[^"']*["'][^>]*src=["']([^"']+)["']/i) ||
                     html.match(/src=["']([^"']+)["'][^>]*class=["'][^"']*(?:poster|cover|thumb)[^"']*["']/i);

  // Sinopse no corpo
  const descMatch = html.match(/class=["'][^"']*(?:summary|synopsis|description|content)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);

  // Status
  const isCompleted = html.includes('Completed') || html.includes('completed');
  const status = isCompleted ? 'completed' : 'ongoing';

  // Gêneros
  const genres = [];
  const genreRegex = /href=["'][^"']*\/genre\/[^"']*["'][^>]*>([^<]+)<\/a>/gi;
  let gm;
  while ((gm = genreRegex.exec(html)) !== null) {
    if (!genres.includes(gm[1].trim())) {
      genres.push(gm[1].trim());
    }
  }

  // Autor
  const authorMatch = html.match(/Author\(s\):?[\s\S]*?<a[^>]*>([^<]+)<\/a>/i) ||
                      html.match(/Author:?[\s\S]*?<a[^>]*>([^<]+)<\/a>/i);

  console.log('Resultados Mgeko:');
  console.log('Título:', h1Match ? h1Match[1].trim() : ogTitle);
  console.log('Capa:', ogImage || (coverMatch ? coverMatch[1] : null));
  console.log('Sinopse Meta:', ogDesc);
  console.log('Gêneros:', genres);
  console.log('Autor:', authorMatch ? authorMatch[1].trim() : null);
  console.log('Status:', status);
}

testMgeko();

