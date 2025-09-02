@echo off
echo 🚀 Avvio Backend Adagio in modalità sviluppo...
echo.
cd /d "%~dp0"
echo 📁 Directory corrente: %CD%
echo.
echo 🔧 Controllo dipendenze...
if not exist "node_modules" (
    echo ⚠️  Dipendenze non trovate. Installazione in corso...
    npm install
    echo.
)
echo.
echo 🌐 Avvio server in modalità sviluppo (con auto-reload)...
echo.
npm run dev
pause
