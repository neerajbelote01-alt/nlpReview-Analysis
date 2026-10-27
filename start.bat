@echo off
echo ========================================================
echo       Starting ReviewIQ AI Full-Stack Application
echo ========================================================
echo.

echo Starting FastAPI Backend on http://localhost:8000 ...
start "ReviewIQ Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --reload --port 8000"

timeout /t 2 /nobreak >nul

echo Starting Vite React Frontend on http://localhost:5173 ...
start "ReviewIQ Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo Application is launching!
echo Backend API Docs: http://localhost:8000/docs
echo Frontend Web App: http://localhost:5173
echo ========================================================
pause
