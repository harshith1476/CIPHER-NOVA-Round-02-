@echo off
echo ========================================
echo QWIPO AI PLATFORM - RESTART SCRIPT
echo ========================================
echo.

echo Stopping all processes...
taskkill /F /IM python.exe 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting Backend Server...
cd backend
start "Qwipo Backend" cmd /k "python app.py"
timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend Server...
cd ..\frontend
start "Qwipo Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo SERVERS STARTED!
echo ========================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C in each window to stop servers.
echo.
pause

