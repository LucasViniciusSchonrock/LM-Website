import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Luke Manhwa | Catálogo de Obras & Recomendações',
  description: 'Obras, resenhas e indicações de Manhwas selecionadas pelo canal Luke Manhwa com dados sincronizados do MangaDex.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Luke Manhwa',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0B0E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className="min-h-screen bg-[#0B0B0E] text-slate-100 antialiased selection:bg-purple-600 selection:text-white">
        {/* Luz de fundo roxa ambiente estilo Apple */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-purple-700/15 blur-[120px]" />
          <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-700/10 blur-[140px]" />
          <div className="absolute bottom-[-10%] left-[30%] w-[450px] h-[450px] rounded-full bg-fuchsia-700/10 blur-[130px]" />
        </div>
        {children}
      </body>
    </html>
  );
}

