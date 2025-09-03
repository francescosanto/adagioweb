@echo off
echo 🧪 Test API Adagio
echo.

echo 🔍 Test Health Check...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:5001/api/health' -Method GET; Write-Host '✅ Health Check: OK' -ForegroundColor Green; Write-Host '   Status:' $response.status; Write-Host '   Environment:' $response.environment } catch { Write-Host '❌ Health Check: FAILED' -ForegroundColor Red }"

echo.
echo 📋 Test API Bookings...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:5001/api/bookings' -Method GET; Write-Host '✅ Bookings API: OK' -ForegroundColor Green; Write-Host '   Prenotazioni trovate:' $response.Count } catch { Write-Host '❌ Bookings API: FAILED' -ForegroundColor Red }"

echo.
echo ⭐ Test API Reviews...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:5001/api/reviews' -Method GET; Write-Host '✅ Reviews API: OK' -ForegroundColor Green; Write-Host '   Recensioni trovate:' $response.reviews.Count } catch { Write-Host '❌ Reviews API: FAILED' -ForegroundColor Red }"

echo.
echo 📊 Test API Availability...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:5001/api/availability/2025-09-03' -Method GET; Write-Host '✅ Availability API: OK' -ForegroundColor Green; Write-Host '   Orari disponibili:' $response.Count } catch { Write-Host '❌ Availability API: FAILED' -ForegroundColor Red }"

echo.
echo 🎯 Test Completati!
echo.
echo 💡 Premi un tasto per chiudere...
pause > nul
