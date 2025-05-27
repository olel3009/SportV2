@echo off
setlocal

echo Checking for Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not found in PATH.
    pause
    exit /b 1
)
echo Python found.
echo.

echo Creating virtual environment 'venv'...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment.
    pause
    exit /b 1
)
echo Virtual environment created.
echo.

echo Activating virtual environment...
call .\venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment.
    pause
    exit /b 1
)
echo Virtual environment activated.
echo.

echo Installing Python requirements...
if exist requirements.txt (
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: Failed to install Python requirements.
        pause
        exit /b 1
    )
    echo Python requirements installed.
) else (
    echo WARNING: requirements.txt not found. Skipping pip install.
)
echo.

echo Checking for Node.js/npm...
call npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js/npm is not installed or not found in PATH.
    echo Please install Node.js and ensure npm is in your PATH.
    pause
    exit /b 1
)
echo Node.js/npm found.
echo.

echo Installing frontend npm packages...
if exist .\frontend\package.json (
    cd frontend
    call npm install --force
    if errorlevel 1 (
        echo ERROR: Failed to install npm packages.
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo Frontend npm packages installed.
) else (
    echo WARNING: .\frontend\package.json not found. Skipping npm install.
)
echo.

echo ==================================================
echo Setup script finished.
echo ==================================================
echo.
pause
exit /b 0