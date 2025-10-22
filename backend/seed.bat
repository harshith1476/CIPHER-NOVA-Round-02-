@echo off
echo Seeding Qwipo AI Database...
echo.

REM Activate virtual environment if it exists
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
)

REM Run seed script
python seed_data.py

echo.
pause

