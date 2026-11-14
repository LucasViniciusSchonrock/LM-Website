import fs from 'fs';
import path from 'path';
import { SubscriberRecommendation } from '@/types/manhwa';

const OBS_HUB_STATE_PATH = 'C:\\Users\\lucas\\3D Objects\\LM Stream [OBS HUB]\\data\\state.json';
const LOCAL_BACKUP_PATH = path.join(process.cwd(), 'data', 'subscriber-recommendations.json');

export function getSubscriberRecommendations(): SubscriberRecommendation[] {
  try {
    // 1. Tenta ler direto do LM Stream [OBS HUB] (dados em tempo real da live)
    if (fs.existsSync(OBS_HUB_STATE_PATH)) {
      const raw = fs.readFileSync(OBS_HUB_STATE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.recommendations)) {
        // Salva espelho local para quando estiver na Vercel
        try {
          const dir = path.dirname(LOCAL_BACKUP_PATH);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(LOCAL_BACKUP_PATH, JSON.stringify(parsed.recommendations, null, 2), 'utf-8');
        } catch {}
        return parsed.recommendations;
      }
    }
  } catch (err) {
    console.warn('Erro ao ler recomendações do OBS HUB, tentando backup local:', err);
  }

  // 2. Fallback para backup local
  try {
    if (fs.existsSync(LOCAL_BACKUP_PATH)) {
      const raw = fs.readFileSync(LOCAL_BACKUP_PATH, 'utf-8');
      return JSON.parse(raw) as SubscriberRecommendation[];
    }
  } catch (err) {
    console.error('Erro ao ler backup local de recomendações:', err);
  }

  return [];
}
