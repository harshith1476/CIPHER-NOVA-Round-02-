@echo off
echo ========================================
echo   QWIPO AI PLATFORM - FRONTEND SERVER
echo ========================================
echo.

echo Installing/Updating Node.js dependencies...
npm install
echo.

echo Starting React Frontend Development Server...
echo Frontend will be available at: http://localhost:5173
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause
