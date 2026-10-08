#!/bin/bash

# Pet Community Platform - Test Suite Runner (Linux/Mac)

echo ""
echo "========================================"
echo "Pet Community Platform - Test Suite"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 is not installed"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    exit 1
fi

echo "[1/4] Installing backend dependencies..."
cd backend
pip install -q fastapi uvicorn pydantic python-multipart
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    cd ..
    exit 1
fi
cd ..
echo "[OK] Backend dependencies installed"

echo ""
echo "[2/4] Installing frontend dependencies..."
cd frontend
npm install --legacy-peer-deps > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    cd ..
    exit 1
fi
cd ..
echo "[OK] Frontend dependencies installed"

echo ""
echo "[3/4] Installing Playwright browsers..."
npx playwright install --with-deps > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "WARNING: Playwright installation had issues, continuing anyway"
fi
echo "[OK] Playwright ready"

echo ""
echo "[4/4] Running test suite..."
python3 run_test_suite.py

if [ $? -ne 0 ]; then
    echo ""
    echo "========================================"
    echo "TEST SUITE FAILED"
    echo "========================================"
    exit 1
else
    echo ""
    echo "========================================"
    echo "TEST SUITE COMPLETED SUCCESSFULLY"
    echo "========================================"
    exit 0
fi
