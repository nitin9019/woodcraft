@echo off
title WoodCraft Startup
echo ============================================
echo    WoodCraft Furniture Services Launcher
echo ============================================
echo.

:: Kill any processes on ports 9999 and 5173
echo [1/4] Clearing ports 9999 and 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":9999 " 2^>nul') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173 " 2^>nul') do taskkill /PID %%a /F >nul 2>&1
timeout /t 2 /nobreak >nul

:: Start Backend
echo [2/4] Starting Backend (FastAPI on port 9999)...
start "WoodCraft Backend" /D "C:\Users\Nitih Rajesh Gawade\Desktop\Project 1\backend" "C:\Users\Nitih Rajesh Gawade\Desktop\Project 1\backend\venv\Scripts\uvicorn.exe" main:app --host 0.0.0.0 --port 9999

:: Wait for backend to start
echo [3/4] Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

:: Start Frontend
echo [4/4] Starting Frontend (Vite on port 5173)...
start "WoodCraft Frontend" /D "C:\Users\Nitih Rajesh Gawade\Desktop\Project 1\frontend" cmd /c "npm run dev"

echo.
echo ============================================
echo  BOTH SERVERS STARTED!
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:9999/docs
echo  Admin:    username=admin  password=admin
echo ============================================
echo.
echo Closing this window in 5 seconds...
timeout /t 5 /nobreak >nul
