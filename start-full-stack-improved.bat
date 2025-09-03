@echo off
echo 🚀 Avvio Full-Stack Adagio (Frontend + Backend) - Versione Migliorata
echo.

cd /d "%~dp0"

echo 📁 Directory corrente: %CD%
echo.

echo 🔧 Controllo se il backend è già attivo...
powershell -Command "try { Invoke-RestMethod -Uri 'http://localhost:5001/api/health' -Method GET -TimeoutSec 2 | Out-Null; Write-Host '✅ Backend già attivo' } catch { Write-Host '⚠️  Backend non attivo, avvio in corso...' }"

echo.
echo 🌐 Avvio Backend sulla porta 5001...
echo 📂 Percorso backend: %CD%\backend

REM Crea un file batch temporaneo per il backend
echo @echo off > temp_backend.bat
echo cd /d "%CD%\backend" >> temp_backend.bat
echo echo 🔧 Avvio Backend Adagio... >> temp_backend.bat
echo echo 📁 Directory: %%CD%% >> temp_backend.bat
echo echo. >> temp_backend.bat
echo node server.js >> temp_backend.bat
echo pause >> temp_backend.bat

start "Backend Adagio" cmd /k temp_backend.bat

echo.
echo ⏳ Attendo 5 secondi per l'avvio del backend...
timeout /t 5 /nobreak > nul

echo.
echo 🔍 Verifica avvio backend...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:5001/api/health' -Method GET -TimeoutSec 3; Write-Host '✅ Backend attivo e funzionante!' } catch { Write-Host '❌ Backend non risponde, controlla i log' }"

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
echo 🔧 Test API:
echo    📋 Prenotazioni: http://localhost:5001/api/bookings
echo    ⭐ Recensioni:   http://localhost:5001/api/reviews
echo.
echo 💡 Premi un tasto per chiudere questo script...
pause > nul

REM Pulisci il file temporaneo
del temp_backend.bat 2>nul
