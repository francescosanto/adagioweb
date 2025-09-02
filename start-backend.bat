@echo off
echo 🚀 Avvio Backend Adagio...
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
echo 🌐 Avvio server sulla porta 5001...
echo.
node server.js
pause
