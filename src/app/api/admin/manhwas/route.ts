import { NextRequest, NextResponse } from 'next/server';
import { getLocalManhwas, saveLocalManhwas, isLocalhost } from '@/lib/manhwas';
import { downloadAndSaveCover } from '@/lib/covers-server';
import { Manhwa } from '@/types/manhwa';

export async function GET(request: NextRequest) {
  if (!isLocalhost(request.headers)) {
    return NextResponse.json(
      { error: 'Acesso restrito ao ambiente local (localhost).' },
      { status: 403 }
    );
  }

  const manhwas = getLocalManhwas();
  return NextResponse.json(manhwas);
}

export async function POST(request: NextRequest) {
  if (!isLocalhost(request.headers)) {
    return NextResponse.json(
      { error: 'O painel administrativo está bloqueado em produção (Vercel).' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const manhwas = getLocalManhwas();

    const now = new Date().toISOString();
    const targetId = body.id || `lm-${Date.now()}`;

    // Baixa e salva a capa localmente em public/covers/ para máxima velocidade e independência
    let finalCoverUrl = body.coverUrl;
    if (body.coverUrl && !body.coverUrl.startsWith('/covers/')) {
      finalCoverUrl = await downloadAndSaveCover(body.coverUrl, targetId);
    }

    const manhwaData: Manhwa = {
      ...body,
      id: targetId,
      coverUrl: finalCoverUrl,
      updatedAt: now,
    };

    let updatedList: Manhwa[] = [];

    // Se já existir, atualiza
    if (manhwas.some((m) => m.id === targetId)) {
      updatedList = manhwas.map((item) =>
        item.id === targetId ? { ...item, ...manhwaData } : item
      );
    } else {
      // Novo manhwa
      manhwaData.createdAt = now;
      updatedList = [manhwaData, ...manhwas];
    }

    const success = saveLocalManhwas(updatedList);
    if (!success) {
      return NextResponse.json(
        { error: 'Falha ao gravar arquivo manhwas.json localmente.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, manhwa: manhwaData, count: updatedList.length });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: err.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isLocalhost(request.headers)) {
    return NextResponse.json(
      { error: 'Acesso restrito ao localhost.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID da obra não informado.' }, { status: 400 });
    }

    const manhwas = getLocalManhwas();
    const updatedList = manhwas.filter((item) => item.id !== id);

    const success = saveLocalManhwas(updatedList);
    if (!success) {
      return NextResponse.json({ error: 'Falha ao salvar exclusão.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, remaining: updatedList.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
