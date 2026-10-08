@echo off
REM Pet Community Platform - Test Suite Runner (Windows)

echo.
echo ========================================
echo Pet Community Platform - Test Suite
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    exit /b 1
)

echo [1/4] Installing backend dependencies...
cd backend
pip install -q fastapi uvicorn pydantic python-multipart
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    cd ..
    exit /b 1
)
cd ..
echo [OK] Backend dependencies installed

echo.
echo [2/4] Installing frontend dependencies...
cd frontend
call npm install --legacy-peer-deps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    cd ..
    exit /b 1
)
cd ..
echo [OK] Frontend dependencies installed

echo.
echo [3/4] Installing Playwright browsers...
call npx playwright install --with-deps >nul 2>&1
if errorlevel 1 (
    echo WARNING: Playwright installation had issues, continuing anyway
)
echo [OK] Playwright ready

echo.
echo [4/4] Running test suite...
python run_test_suite.py

if errorlevel 1 (
    echo.
    echo ========================================
    echo TEST SUITE FAILED
    echo ========================================
    exit /b 1
) else (
    echo.
    echo ========================================
    echo TEST SUITE COMPLETED SUCCESSFULLY
    echo ========================================
    exit /b 0
)
