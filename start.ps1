Write-Host "Starting WoodCraft Furniture Services..." -ForegroundColor Cyan

Write-Host "Starting Backend (FastAPI) on port 9999..."
Start-Process powershell -ArgumentList "-NoExit -Command `"cd backend; .\venv\Scripts\activate; uvicorn main:app --reload --port 9999`""

Write-Host "Starting Frontend (React/Vite)..."
Start-Process powershell -ArgumentList "-NoExit -Command `"cd frontend; npm run dev`""

Write-Host "Servers started in new windows!" -ForegroundColor Green
