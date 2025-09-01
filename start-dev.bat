@echo off
echo Avvio sistema di sviluppo Adagio...
echo.

echo Avvio backend (porta 5001)...
start "Backend Adagio" cmd /k "npm run server:dev"

echo Attendo 3 secondi per l'avvio del backend...
powershell -Command "Start-Sleep -Seconds 3"

echo Avvio frontend (porta 3000)...
start "Frontend Adagio" cmd /k "npm run start"

echo.
echo Entrambi i servizi sono stati avviati!
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3000
echo.
echo Premi un tasto per chiudere questo messaggio...
pause > nul
