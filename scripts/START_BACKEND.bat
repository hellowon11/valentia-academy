@echo off
cd /d "%~dp0\.."
echo ==========================================
echo   Starting Valentia Backend Server
echo ==========================================
echo.

if not exist "server\package.json" (
    echo ERROR: server\package.json not found!
    echo Please make sure you are in the project root directory.
    pause
    exit /b 1
)

cd server
echo Current directory: %CD%

:: Check node_modules
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting Node.js server...
echo ------------------------------------------
npm start
pause
