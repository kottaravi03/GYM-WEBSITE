@echo off
REM Pet Community Platform - Helm Deployment Script (Windows)

setlocal enabledelayedexpansion

REM Configuration
set RELEASE_NAME=pet-community
set NAMESPACE=pet-community
set CHART_PATH=.\deploy\helm\pet-community
set REGISTRY=docker.io
set BACKEND_IMAGE=%REGISTRY%/pet-community-backend
set FRONTEND_IMAGE=%REGISTRY%/pet-community-frontend
set IMAGE_TAG=latest

if not "%REGISTRY%"=="" (
    set BACKEND_IMAGE=%REGISTRY%/pet-community-backend
    set FRONTEND_IMAGE=%REGISTRY%/pet-community-frontend
)

if not "%IMAGE_TAG%"=="" (
    set IMAGE_TAG=%IMAGE_TAG%
)

echo.
echo ==========================================
echo Pet Community Platform - Helm Deployment
echo ==========================================
echo.

REM Check prerequisites
echo [1/5] Checking prerequisites...
kubectl version >nul 2>&1
if errorlevel 1 (
    echo ERROR: kubectl is not installed
    exit /b 1
)

helm version >nul 2>&1
if errorlevel 1 (
    echo ERROR: helm is not installed
    exit /b 1
)

kubectl cluster-info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Cannot connect to Kubernetes cluster
    exit /b 1
)
echo [OK] Prerequisites check passed

REM Create namespace
echo.
echo [2/5] Creating namespace: %NAMESPACE%
kubectl create namespace %NAMESPACE% --dry-run=client -o yaml | kubectl apply -f -
echo [OK] Namespace created

REM Validate chart
echo.
echo [3/5] Validating Helm chart...
helm lint %CHART_PATH%
if errorlevel 1 (
    echo ERROR: Helm chart validation failed
    exit /b 1
)
echo [OK] Chart validation passed

REM Install/Upgrade chart
echo.
echo [4/5] Installing Helm chart...
helm list -n %NAMESPACE% | findstr %RELEASE_NAME% >nul 2>&1
if errorlevel 1 (
    echo Installing new release...
    helm install %RELEASE_NAME% %CHART_PATH% ^
        --namespace %NAMESPACE% ^
        --set backend.image.repository=%BACKEND_IMAGE% ^
        --set backend.image.tag=%IMAGE_TAG% ^
        --set frontend.image.repository=%FRONTEND_IMAGE% ^
        --set frontend.image.tag=%IMAGE_TAG% ^
        --wait ^
        --timeout 5m
) else (
    echo Upgrading existing release...
    helm upgrade %RELEASE_NAME% %CHART_PATH% ^
        --namespace %NAMESPACE% ^
        --set backend.image.repository=%BACKEND_IMAGE% ^
        --set backend.image.tag=%IMAGE_TAG% ^
        --set frontend.image.repository=%FRONTEND_IMAGE% ^
        --set frontend.image.tag=%IMAGE_TAG% ^
        --wait ^
        --timeout 5m
)

if errorlevel 1 (
    echo ERROR: Helm deployment failed
    exit /b 1
)
echo [OK] Helm chart deployed

REM Verify deployment
echo.
echo [5/5] Verifying deployment...
echo.
echo Pods:
kubectl get pods -n %NAMESPACE%
echo.
echo Services:
kubectl get svc -n %NAMESPACE%
echo.
echo Ingress:
kubectl get ingress -n %NAMESPACE%

echo.
echo ==========================================
echo Deployment Complete!
echo ==========================================
echo.
echo Access Information:
echo.
echo Frontend:
echo   kubectl port-forward -n %NAMESPACE% svc/frontend 3000:3000
echo   Then access: http://localhost:3000
echo.
echo Backend:
echo   kubectl port-forward -n %NAMESPACE% svc/backend 8000:8000
echo   Then access: http://localhost:8000
echo.
