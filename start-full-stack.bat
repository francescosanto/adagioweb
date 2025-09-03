@echo off
echo 🚀 Avvio Full-Stack Adagio (Frontend + Backend)
echo.

cd /d "%~dp0"

echo 📁 Directory corrente: %CD%
echo.

echo 🔧 Controllo se il backend è già attivo...
powershell -Command "try { Invoke-RestMethod -Uri 'http://localhost:5001/api/health' -Method GET -TimeoutSec 2 | Out-Null; Write-Host '✅ Backend già attivo' } catch { Write-Host '⚠️  Backend non attivo, avvio in corso...' }"

echo.
echo 🌐 Avvio Backend sulla porta 5001...
start "Backend Adagio" cmd /k "cd /d \"%CD%\backend\" && node server.js"

echo.
echo ⏳ Attendo 3 secondi per l'avvio del backend...
timeout /t 3 /nobreak > nul

echo.
echo 🎨 Avvio Frontend sulla porta 3000...
start "Frontend Adagio" cmd /k "npm start"

echo.
echo ✅ Entrambi i servizi sono stati avviati!
echo.
echo 📊 Servizi disponibili:
echo    🌐 Frontend: http://localhost:3000
echo    🔧 Backend:  http://localhost:5001
echo    📡 API:      http://localhost:5001/api/health
echo.
echo 💡 Premi un tasto per chiudere questo script...
pause > nul
