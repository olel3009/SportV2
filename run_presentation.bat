@echo off
setlocal

echo Attempting to activate virtual environment from '.\venv'...
set VENV_ACTIVATION_SCRIPT=.\venv\Scripts\activate.bat

if not exist "%VENV_ACTIVATION_SCRIPT%" (
    echo ERROR: Virtual environment activation script not found at:
    echo %VENV_ACTIVATION_SCRIPT%
    echo Please run the setup_env.bat script first.
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

echo Building Frontend (npm run build)...
if exist .\frontend\package.json (
    cd frontend
    call npm run build
    if errorlevel 1 (
        echo ERROR: Frontend build failed. Check the output above.
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo Frontend build finished.
) else (
    echo WARNING: .\frontend\package.json not found. Skipping frontend build.
)
echo.

echo Running database discipline script...
if exist database\discipline.py (
    python database\discipline.py
    if errorlevel 1 (
        echo ERROR: Failed to run database discipline script.
        pause
        exit /b 1
    )
    echo Database discipline script finished.
) else (
    echo WARNING: database\discipline.py not found. Skipping discipline script.
)
echo.

echo Starting Backend (Flask)...
start "Backend" flask --app run.py run
echo Backend process launched in a new window.
echo.

echo Starting Frontend (npm run dev)...
if exist .\frontend\package.json (
    cd frontend
    start "Frontend" npm run dev
    cd ..
    echo Frontend process launched in a new window.
) else (
    echo WARNING: .\frontend\package.json not found. Cannot start frontend dev server.
)
echo.

echo ==================================================
echo Launch script finished. Check the new windows for
echo Backend (Flask) and Frontend (Vite/React/etc.)
echo ==================================================
echo.
pause
exit /b 0