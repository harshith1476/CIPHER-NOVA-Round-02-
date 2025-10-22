@echo off
echo ========================================
echo    QWIPO AI PLATFORM - COMPLETE STARTUP
echo ========================================
echo.

echo Starting MongoDB service...
net start MongoDB > nul 2>&1
echo MongoDB service started
echo.

echo Starting Backend Server...
start "Qwipo Backend" cmd /k "cd Qwipo-Backend && START_BACKEND.bat"
echo Backend server starting...
echo.

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Qwipo Frontend" cmd /k "cd Qwipo-Frontend && START_FRONTEND.bat"
echo Frontend server starting...
echo.

echo ========================================
echo           STARTUP COMPLETE
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Test Credentials:
echo Admin: admin@qwipo.ai / admin123
echo Head Retailer: head.retailer@qwipo.ai / headretailer123
echo Head Distributor: head.distributor@qwipo.ai / headdistributor123
echo Retailer: retailer1@example.com / password123
echo Distributor: distributor1@example.com / password123
echo.
echo Press any key to close this window...
pause > nul
