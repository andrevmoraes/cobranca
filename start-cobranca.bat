@echo off
cd /d %~dp0

echo [LOG] Instalando dependências...
npm install

echo [LOG] Dependências instaladas. Iniciando servidor Vite...
start cmd /k "npm run dev -- --host 0.0.0.0"

echo [LOG] Você pode fechar esta janela, o servidor está rodando em outra aba.
pause