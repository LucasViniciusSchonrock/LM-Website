@echo off
title Luke Manhwa - Encerrar Servidor e App
echo ===================================================
echo Encerrando servidor e aplicativo Luke Manhwa [Obras]...
echo ===================================================

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
    echo Servidor na porta 3000 encerrado com sucesso! (PID: %%a)
)

echo.
echo Processos encerrados. Voce pode fechar esta janela.
timeout /t 2 >nul
