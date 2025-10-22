@echo off
echo ========================================
echo    QWIPO AI PLATFORM - BACKEND SERVER
echo ========================================
echo.

echo Starting MongoDB service...
net start MongoDB > nul 2>&1
if %errorlevel% neq 0 (
    echo MongoDB is already running or not installed as service
) else (
    echo MongoDB started successfully
)
echo.

echo Installing/Updating Python dependencies...
pip install -r requirements.txt
echo.

echo Seeding database with comprehensive data...
python seed_comprehensive_data.py
echo.

echo Starting Flask Backend Server...
echo Server will be available at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

python app.py

pause
