import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('URL de imagem não informada', { status: 400 });
  }

  try {
    const res = await fetch(imageUrl);

    if (!res.ok) {
      if (imageUrl.endsWith('.512.jpg')) {
        const rawRes = await fetch(imageUrl.replace('.512.jpg', ''));
        if (rawRes.ok) {
          const buffer = await rawRes.arrayBuffer();
          return new NextResponse(buffer, {
            headers: {
              'Content-Type': rawRes.headers.get('content-type') || 'image/jpeg',
              'Cache-Control': 'public, max-age=86400, immutable',
            },
          });
        }
      }
      return new NextResponse('Imagem não encontrada', { status: res.status });
    }

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': res.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (error: any) {
    return new NextResponse('Erro no carregamento da capa', { status: 500 });
  }
}
