import { NextResponse } from 'next/server';
import { getSubscriberRecommendations } from '@/lib/subscriber-recommendations';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = getSubscriberRecommendations();
    return NextResponse.json({ success: true, count: data.length, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Falha ao buscar recomendações' },
      { status: 500 }
    );
  }
}
