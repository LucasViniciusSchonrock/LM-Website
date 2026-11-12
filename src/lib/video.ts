/**
 * Converte URLs do YouTube (watch, youtu.be, shorts, embed) em URL pronta para iframe embed,
 * preservando o tempo de início (&t=... ou ?t=...)
 */
export function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;

  try {
    const trimmed = url.trim();

    // Extrai o parâmetro de tempo (ex: t=31655s ou t=31655)
    let startTime = '';
    const timeMatch = trimmed.match(/[?&]t=([0-9]+)s?/);
    if (timeMatch && timeMatch[1]) {
      startTime = `&start=${timeMatch[1]}`;
    }

    let videoId = '';

    // YouTube Shorts: https://www.youtube.com/shorts/VIDEO_ID
    const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch && shortsMatch[1]) {
      videoId = shortsMatch[1];
    }

    // YouTube padrão: https://www.youtube.com/watch?v=VIDEO_ID
    if (!videoId) {
      const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/);
      if (watchMatch && watchMatch[1]) {
        videoId = watchMatch[1];
      }
    }

    // YouTube encurtado: https://youtu.be/VIDEO_ID
    if (!videoId) {
      const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      if (shortMatch && shortMatch[1]) {
        videoId = shortMatch[1];
      }
    }

    // Já é embed
    if (!videoId && trimmed.includes('youtube.com/embed/')) {
      const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
      if (embedMatch && embedMatch[1]) {
        videoId = embedMatch[1];
      }
    }

    if (videoId) {
      return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0${startTime}`;
    }

    return null;
  } catch {
    return null;
  }
}
