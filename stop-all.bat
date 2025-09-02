@echo off
echo 🛑 Fermata di tutti i servizi Adagio...
echo.

echo 🔍 Ricerca processi Node.js attivi...
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ⚠️  Trovati processi Node.js attivi
    echo.
    echo 🛑 Terminazione processi Node.js...
    taskkill /F /IM node.exe >NUL 2>&1
    if %ERRORLEVEL%==0 (
        echo ✅ Tutti i processi Node.js sono stati terminati
    ) else (
        echo ❌ Errore nella terminazione dei processi
    )
) else (
    echo ✅ Nessun processo Node.js attivo trovato
)

echo.
echo 🔍 Ricerca processi npm attivi...
tasklist /FI "IMAGENAME eq npm.exe" 2>NUL | find /I /N "npm.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ⚠️  Trovati processi npm attivi
    echo.
    echo 🛑 Terminazione processi npm...
    taskkill /F /IM npm.exe >NUL 2>&1
    if %ERRORLEVEL%==0 (
        echo ✅ Tutti i processi npm sono stati terminati
    ) else (
        echo ❌ Errore nella terminazione dei processi
    )
) else (
    echo ✅ Nessun processo npm attivo trovato
)

echo.
echo 🧹 Pulizia completata!
echo.
echo 💡 Premi un tasto per chiudere...
pause > nul
