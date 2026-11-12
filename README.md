# 🟣 Luke Manhwa - Website & Catálogo de Obras

Website oficial do canal **Luke Manhwa**, com interface moderna inspirada no ecossistema **Apple / iOS** (Glassmorphism, frosted glass, cantos arredondados, paleta roxa neon e animações suaves).

---

## 🚀 Como Iniciar no Computador (Local)

Você pode iniciar o app de várias formas:

- **Menu Iniciar do Windows:** Procure por `LM Website [Obras]` no Menu Iniciar.
- **Modo Desktop / Electron:** Dê um duplo clique no arquivo `Iniciar Luke Manhwa.vbs` ou execute `npm run electron` no terminal. Ele abre a janela desktop oficial do Electron e inicializa o servidor local automaticamente.
- **Para Encerrar:** Dê um duplo clique em `Encerrar Luke Manhwa.bat`.

Ou modo desenvolvimento puro via terminal:
```bash
npm run dev
```

---

## 🛡️ Painel Admin (Exclusivo Localhost)

O painel de administração permite gerenciar o catálogo com dados sincronizados do **MangaDex**:

- **Acesso:** Acesse `http://localhost:3000/admin` (ou clique no botão **Admin Local** no canto superior direito do site quando estiver no localhost).
- **Importação do MangaDex:** Digite o nome de qualquer manhwa e o sistema puxa automaticamente em segundos:
  - Título oficial e título original em Hangul
  - Capas em alta definição da CDN do MangaDex
  - Autores e artistas
  - Status (em andamento / finalizado)
  - Sinopse traduzida e tags de gêneros
- **Personalização do Luke:**
  - Marcar como **"Recomendado pelo Luke"** (Selo Top Luke com fogo)
  - Marcar como **"Destaque da Home"** (Banner Hero estilo App Store no topo da página)
  - Adicionar a **Resenha Pessoal do Luke**
  - Adicionar o link do **Vídeo de Análise (YouTube / TikTok)**
- **Segurança no Vercel:** Quando o site estiver publicado online no Vercel, a rota `/admin` e as rotas de gravação são bloqueadas para qualquer visitante da internet (apenas leitura do catálogo estático).

---

## 🌐 Como Publicar no Vercel

1. Suba esta pasta para um repositório no seu GitHub.
2. Acesse [vercel.com](https://vercel.com) e clique em **"Add New Project"**.
3. Importe o repositório do **Luke Manhwa**.
4. O Vercel detectará automaticamente o **Next.js**. Clique em **Deploy**!
5. Sempre que você adicionar novas obras no seu computador através do Admin local, as alterações ficam salvas no arquivo `data/manhwas.json`. Basta fazer um `git push` para atualizar o site no Vercel instantaneamente.

---

## 🎨 Paleta de Cores & Design
- **Estilo:** iOS 17/18 / macOS Sonoma (Apple Design Guidelines)
- **Cor Primária:** Roxo Apple / Violeta Neon (`#8B5CF6`, `#AF52DE`)
- **Fundo:** Dark OLED (`#0B0B0E`) com ambient glow roxo e azul

