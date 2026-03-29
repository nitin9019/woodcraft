@echo off
echo Starting WoodCraft Backend on port 9999...
start "WoodCraft Backend" cmd /k "cd /d C:\Users\Nitih Rajesh Gawade\Desktop\Project 1\backend && call venv\Scripts\activate.bat && python -m uvicorn main:app --host 0.0.0.0 --port 9999 --reload"

timeout /t 3 /nobreak > nul

echo Starting WoodCraft Frontend on port 5173...
start "WoodCraft Frontend" cmd /k "cd /d C:\Users\Nitih Rajesh Gawade\Desktop\Project 1\frontend && npm run dev"

echo.
echo Both servers launched! Open http://localhost:5173 in your browser.
