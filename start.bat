@echo off
title WoodCraft Launcher
echo Starting WoodCraft...

echo Clearing ports...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":9999 " 2^>nul') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173 " 2^>nul') do taskkill /PID %%a /F >nul 2>&1
timeout /t 1 /nobreak >nul

echo Starting Backend...
start "WoodCraft Backend"c cmd /k "cd /d "%~dp0backend" && venv\Scripts\activate.bat && uvicorn main:app --reload --port 9999"

timeout /t 3 /nobreak >nul

echo Starting Frontend...
start "WoodCraft Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo  Backend:  http://localhost:9999/docs
echo  Frontend: http://localhost:5173
echo  Admin:    admin / admin
echo.
pause
