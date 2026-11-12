const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const http = require('http');
const { spawn, exec } = require('child_process');
const fs = require('fs');

// Identificador oficial do app para a barra de tarefas do Windows
app.setAppUserModelId('Luke Manhwa [Obras]');

let mainWindow = null;
let serverProcess = null;
let serverSpawnedByUs = false;

const PORT = 3000;
const APP_URL = `http://localhost:${PORT}`;
const APP_ICON = fs.existsSync(path.join(__dirname, 'app_icon.ico'))
  ? path.join(__dirname, 'app_icon.ico')
  : path.join(__dirname, 'public', 'logo.png');

function checkServerReady(port, callback) {
  const req = http.get(`http://127.0.0.1:${port}/api/manhwas`, (res) => {
    callback(true);
  });
  req.on('error', () => {
    callback(false);
  });
  req.setTimeout(800, () => {
    req.destroy();
    callback(false);
  });
}

function startNextServer() {
  if (serverProcess) return;

  console.log('[Electron] Iniciando servidor Next.js em segundo plano...');
  serverSpawnedByUs = true;

  serverProcess = spawn('npm.cmd', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'ignore',
    shell: true,
    windowsHide: true,
    detached: false
  });

  serverProcess.on('error', (err) => {
    console.error('[Electron] Falha ao iniciar Next.js:', err);
  });

  serverProcess.on('exit', (code) => {
    console.log(`[Electron] Next.js encerrado com código: ${code}`);
    serverProcess = null;
  });
}

function killSpawnedServer() {
  if (serverProcess && serverSpawnedByUs) {
    try {
      console.log('[Electron] Encerrando processo do servidor Next.js...');
      // No Windows mata a árvore de processos do child
      if (serverProcess.pid) {
        exec(`taskkill /pid ${serverProcess.pid} /t /f`, () => {});
      }
    } catch (e) {
      console.error('[Electron] Erro ao matar processo do servidor:', e);
    }
    serverProcess = null;
  }
}

function getSplashHtml() {
  const logoPath = path.join(__dirname, 'public', 'logo.png');
  let logoDataUrl = '';
  try {
    if (fs.existsSync(logoPath)) {
      const b64 = fs.readFileSync(logoPath).toString('base64');
      logoDataUrl = `data:image/png;base64,${b64}`;
    }
  } catch (e) {}

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Luke Manhwa [Obras]</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0B0B0E;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      overflow: hidden;
      user-select: none;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      animation: fadeIn 0.8s ease-out;
    }
    .logo-glow {
      position: relative;
      width: 140px;
      height: 140px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .glow-circle {
      position: absolute;
      width: 160px;
      height: 160px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(99, 102, 241, 0.15) 50%, transparent 70%);
      filter: blur(20px);
      animation: pulse 2.5s infinite alternate ease-in-out;
    }
    .logo-img {
      position: relative;
      width: 128px;
      height: 128px;
      border-radius: 28px;
      box-shadow: 0 10px 30px rgba(147, 51, 234, 0.35);
      border: 1px solid rgba(168, 85, 247, 0.3);
      object-fit: cover;
    }
    h1 {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #fff 40%, #c084fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 6px;
    }
    p {
      font-size: 13px;
      color: #a1a1aa;
      margin-bottom: 24px;
    }
    .spinner {
      width: 28px;
      height: 28px;
      border: 3px solid rgba(168, 85, 247, 0.2);
      border-top-color: #a855f7;
      border-radius: 50%;
      animation: spin 0.9s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0% { transform: scale(0.9); opacity: 0.6; }
      100% { transform: scale(1.15); opacity: 1; }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo-glow">
      <div class="glow-circle"></div>
      ${logoDataUrl ? `<img src="${logoDataUrl}" class="logo-img" alt="Luke Manhwa">` : ''}
    </div>
    <h1>Luke Manhwa</h1>
    <p>Iniciando catálogo e servidor local...</p>
    <div class="spinner"></div>
  </div>
</body>
</html>`;
}

function createWindow() {
  Menu.setApplicationMenu(null);

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1080,
    minHeight: 700,
    title: 'LM Website [Obras]',
    icon: APP_ICON,
    backgroundColor: '#0B0B0E',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    }
  });

  mainWindow.setMenuBarVisibility(false);

  // Carrega a tela splash estilizada enquanto o Next.js carrega
  mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(getSplashHtml()));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Intercepta links externos para abrir no navegador do sistema (YouTube, MangaDex, etc.)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) {
      return { action: 'allow' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Atalhos Globais: F11 tela cheia, F12 DevTools, F5 / Ctrl+R Recarregar
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown') return;

    if (input.key === 'F11') {
      event.preventDefault();
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    } else if (input.key === 'F12' || (input.control && input.shift && input.key.toLowerCase() === 'i')) {
      event.preventDefault();
      mainWindow.webContents.toggleDevTools();
    } else if (input.key === 'F5' || (input.control && input.key.toLowerCase() === 'r')) {
      event.preventDefault();
      mainWindow.webContents.reloadIgnoringCache();
    }
  });

  // Verifica se o servidor já está ativo, ou se precisa iniciar
  checkServerReady(PORT, (isReady) => {
    if (isReady) {
      mainWindow.loadURL(APP_URL);
    } else {
      startNextServer();

      // Polling até o servidor responder
      const startTime = Date.now();
      const interval = setInterval(() => {
        checkServerReady(PORT, (ready) => {
          if (ready) {
            clearInterval(interval);
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.loadURL(APP_URL);
            }
          } else if (Date.now() - startTime > 45000) {
            clearInterval(interval);
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.loadURL(APP_URL); // Tenta carregar mesmo assim
            }
          }
        });
      }, 700);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    killSpawnedServer();
  });
}

// Single instance lock para evitar múltiplas instâncias duplicadas
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('before-quit', () => {
    killSpawnedServer();
  });

  app.on('window-all-closed', () => {
    killSpawnedServer();
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

