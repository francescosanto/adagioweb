@echo off
echo ========================================
echo    DEPLOY SITO ADAGIO SU GITHUB
echo ========================================
echo.

echo 1. Buildando l'applicazione...
npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ERRORE: Build fallito!
    pause
    exit /b 1
)

echo.
echo 2. Deploy su GitHub Pages...
npm run deploy

if %ERRORLEVEL% NEQ 0 (
    echo ERRORE: Deploy fallito!
    pause
    exit /b 1
)

echo.
echo ========================================
echo    DEPLOY COMPLETATO CON SUCCESSO!
echo ========================================
echo.
echo Il sito sarà disponibile tra qualche minuto su:
echo https://adagiosevilla.github.io/adagio-website
echo.
pause
