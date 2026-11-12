import { NextResponse } from 'next/server';
import { getLocalManhwas } from '@/lib/manhwas';

export const revalidate = 60; // Revalida a cada 60s em produção

export async function GET() {
  const manhwas = getLocalManhwas();
  return NextResponse.json(manhwas);
}

