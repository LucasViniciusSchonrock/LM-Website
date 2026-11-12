import fs from 'fs';
import path from 'path';
import { Manhwa } from '@/types/manhwa';

const dataFilePath = path.join(process.cwd(), 'data', 'manhwas.json');

export function getLocalManhwas(): Manhwa[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(fileContent) as Manhwa[];
  } catch (error) {
    console.error('Erro ao ler manhwas.json:', error);
    return [];
  }
}

export function saveLocalManhwas(manhwas: Manhwa[]): boolean {
  try {
    const dirPath = path.dirname(dataFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(manhwas, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Erro ao salvar manhwas.json:', error);
    return false;
  }
}

/**
 * Validação de ambiente Localhost vs Vercel
 */
export function isLocalhost(reqHeaders: Headers): boolean {
  const host = reqHeaders.get('host') || '';
  const isVercel = process.env.VERCEL === '1';
  
  if (isVercel) {
    return false;
  }
  
  return (
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    host.startsWith('192.168.') ||
    process.env.NODE_ENV === 'development'
  );
}

