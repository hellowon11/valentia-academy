@echo off
cd /d "%~dp0\.."
echo ===================================================
echo   Starting Valentia Application (Backend + Frontend)
echo ===================================================
echo.

:: Check if server directory exists
if not exist "server\package.json" (
    echo ERROR: server directory not found!
    echo Please make sure you are in the project root directory.
    pause
    exit /b 1
)

:: 1. Start Backend Server
echo [1/2] Starting Backend Server...
start "Valentia Backend" cmd /k "call scripts\START_BACKEND.bat"

:: Wait for backend to initialize
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

:: 2. Start Frontend Server
echo [2/2] Starting Frontend Server...
start "Valentia Frontend" cmd /k "call scripts\START_FRONTEND.bat"

echo.
echo ===================================================
echo   Both servers are starting in separate windows.
echo   Please do not close those windows.
echo   You can access the application at:
echo   - Frontend: http://localhost:5174
echo   - Backend:  http://localhost:3001
echo   - Admin:    http://localhost:5174/admin/login
echo ===================================================
echo.
pause
