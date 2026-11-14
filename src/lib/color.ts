// Paleta de cores vibrantes para fallback determinístico
const VIBRANT_PALETTE = [
  '#8B5CF6', // Roxo Real
  '#EC4899', // Rosa Neon
  '#3B82F6', // Azul Royal
  '#10B981', // Esmeralda
  '#F59E0B', // Âmbar Dourado
  '#EF4444', // Carmesim
  '#06B6D4', // Ciano Cósmico
  '#A855F7', // Violeta
  '#F97316', // Laranja Intenso
  '#14B8A6', // Turquesa
  '#6366F1', // Índigo
];

// Cache em memória para cores já extraídas
const colorCache = new Map<string, string>();

/**
 * Retorna uma cor vibrante consistente baseada no texto (fallback instantâneo)
 */
export function getFallbackColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % VIBRANT_PALETTE.length;
  return VIBRANT_PALETTE[index];
}

/**
 * Converte RGB para um formato vibrante ideal para temas escuros
 */
function makeVibrant(r: number, g: number, b: number): string {
  // Converte para HSL
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  // Garante saturação alta (70-90%) e luminosidade equilibrada (55-65%) para dark mode
  const vibrantS = Math.max(s, 0.75);
  const vibrantL = Math.min(Math.max(l, 0.55), 0.65);

  return hslToHex(h * 360, vibrantS, vibrantL);
}

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Extrai a cor dominante da imagem via canvas em memória
 */
export function extractCoverAccentColor(
  imgElement: HTMLImageElement,
  fallbackSeed: string
): string {
  const src = imgElement.src;
  if (colorCache.has(src)) {
    return colorCache.get(src)!;
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 8;
    canvas.height = 8;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) {
      const fallback = getFallbackColor(fallbackSeed);
      colorCache.set(src, fallback);
      return fallback;
    }

    ctx.drawImage(imgElement, 0, 0, 8, 8);
    const data = ctx.getImageData(0, 0, 8, 8).data;

    let r = 0,
      g = 0,
      b = 0,
      count = 0;

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      // Filtra pixels quase pretos ou brancos estourados
      if (avg > 30 && avg < 235) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
    }

    if (count === 0) {
      const fallback = getFallbackColor(fallbackSeed);
      colorCache.set(src, fallback);
      return fallback;
    }

    const vibrant = makeVibrant(
      Math.round(r / count),
      Math.round(g / count),
      Math.round(b / count)
    );

    colorCache.set(src, vibrant);
    return vibrant;
  } catch {
    const fallback = getFallbackColor(fallbackSeed);
    colorCache.set(src, fallback);
    return fallback;
  }
}
