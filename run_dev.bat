@echo off
setlocal

echo Attempting to activate virtual environment from '.\venv'...
set VENV_ACTIVATION_SCRIPT=.\venv\Scripts\activate.bat

if not exist "%VENV_ACTIVATION_SCRIPT%" (
    echo ERROR: Virtual environment activation script not found at:
    echo %VENV_ACTIVATION_SCRIPT%
    echo Please ensure the 'venv' folder exists and was created correctly.
    pause
    exit /b 1
)

echo Activating...
call "%VENV_ACTIVATION_SCRIPT%"
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment. Check for errors above.
    pause
    exit /b 1
)
echo Virtual environment activated.
echo.

echo Setting Python Path to current directory...
set PYTHONPATH=%CD%
echo PYTHONPATH=%PYTHONPATH%
echo.

echo Seeding database with test data...
python .\database\seed_db.py
if errorlevel 1 (
    echo ERROR: Database seeding failed. Check the python output.
    pause
    exit /b 1
)
echo Database seeding finished.
echo.

echo Starting Backend (Flask)...
start "SPORTV2 Backend" flask --app run.py run
echo Backend process launched in a new window.
echo.

echo Starting Frontend (npm dev)...
cd frontend
start "SPORTV2 Frontend" npm run dev
cd ..
echo Frontend process launched in a new window.
echo.

echo ==================================================
echo Launch script finished. Check the new windows for
echo Backend (Flask) and Frontend (Vite/React/etc.)
echo ==================================================
echo.
pause
exit /b 0
