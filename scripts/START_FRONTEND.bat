@echo off
cd /d "%~dp0\.."
echo ==========================================
echo   Starting Valentia Frontend Server
echo ==========================================
echo.

if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please make sure you are in the project root directory.
    pause
    exit /b 1
)

echo Current directory: %CD%

:: Check node_modules
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting Vite development server...
echo ------------------------------------------
npm run dev
pause
