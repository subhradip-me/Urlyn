@echo off
echo Restarting Urlyn 2.0 Services...

echo.
echo === Stopping existing processes ===
taskkill /F /IM node.exe 2>nul || echo No Node.js processes found
taskkill /F /IM npm.exe 2>nul || echo No npm processes found
timeout /t 2 /nobreak >nul

echo.
echo === Clearing ports ===
netstat -ano | findstr :3000 | for /f "tokens=5" %%a in ('findstr LISTENING') do taskkill /F /PID %%a 2>nul
netstat -ano | findstr :5001 | for /f "tokens=5" %%a in ('findstr LISTENING') do taskkill /F /PID %%a 2>nul
timeout /t 2 /nobreak >nul

echo.
echo === Starting Backend ===
cd /d "d:\Next.js\Urlyn-2.0\Urlyn\backend"
start "Backend" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo === Starting Frontend ===
cd /d "d:\Next.js\Urlyn-2.0\Urlyn"
start "Frontend" cmd /k "npm run dev"

echo.
echo === Services Starting ===
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3000
echo.
echo Check the opened terminals for startup status.
pause
