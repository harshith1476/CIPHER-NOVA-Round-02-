@echo off
echo Starting Qwipo AI Backend Server...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing/Updating dependencies...
pip install -r requirements.txt

REM Check if MongoDB is running
echo Checking MongoDB connection...
python -c "from pymongo import MongoClient; client = MongoClient('mongodb://localhost:27017/'); client.server_info()" >nul 2>&1
if errorlevel 1 (
    echo.
    echo WARNING: MongoDB is not running!
    echo Please start MongoDB before running the application.
    echo.
    pause
    exit /b 1
)

REM Start the Flask application
echo.
echo Starting Flask server...
echo Backend will be available at: http://localhost:5000
echo.
python app.py

pause

