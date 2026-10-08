#!/bin/bash

# Pet Community Platform - Helm Deployment Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
RELEASE_NAME="pet-community"
NAMESPACE="pet-community"
CHART_PATH="./deploy/helm/pet-community"
REGISTRY="${REGISTRY:-docker.io}"
BACKEND_IMAGE="${REGISTRY}/pet-community-backend"
FRONTEND_IMAGE="${REGISTRY}/pet-community-frontend"
IMAGE_TAG="${IMAGE_TAG:-latest}"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed"
        exit 1
    fi
    
    if ! command -v helm &> /dev/null; then
        log_error "helm is not installed"
        exit 1
    fi
    
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
    
    log_info "Prerequisites check passed"
}

create_namespace() {
    log_info "Creating namespace: $NAMESPACE"
    kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
}

validate_chart() {
    log_info "Validating Helm chart..."
    helm lint $CHART_PATH
}

install_chart() {
    log_info "Installing Helm chart..."
    
    helm install $RELEASE_NAME $CHART_PATH \
        --namespace $NAMESPACE \
        --set backend.image.repository=$BACKEND_IMAGE \
        --set backend.image.tag=$IMAGE_TAG \
        --set frontend.image.repository=$FRONTEND_IMAGE \
        --set frontend.image.tag=$IMAGE_TAG \
        --wait \
        --timeout 5m
    
    log_info "Helm chart installed successfully"
}

upgrade_chart() {
    log_info "Upgrading Helm chart..."
    
    helm upgrade $RELEASE_NAME $CHART_PATH \
        --namespace $NAMESPACE \
        --set backend.image.repository=$BACKEND_IMAGE \
        --set backend.image.tag=$IMAGE_TAG \
        --set frontend.image.repository=$FRONTEND_IMAGE \
        --set frontend.image.tag=$IMAGE_TAG \
        --wait \
        --timeout 5m
    
    log_info "Helm chart upgraded successfully"
}

verify_deployment() {
    log_info "Verifying deployment..."
    
    log_info "Checking pods..."
    kubectl get pods -n $NAMESPACE
    
    log_info "Checking services..."
    kubectl get svc -n $NAMESPACE
    
    log_info "Checking ingress..."
    kubectl get ingress -n $NAMESPACE
    
    log_info "Deployment verification complete"
}

show_access_info() {
    log_info "Access Information:"
    echo ""
    echo "Frontend Service:"
    echo "  kubectl port-forward -n $NAMESPACE svc/frontend 3000:3000"
    echo "  Then access: http://localhost:3000"
    echo ""
    echo "Backend Service:"
    echo "  kubectl port-forward -n $NAMESPACE svc/backend 8000:8000"
    echo "  Then access: http://localhost:8000"
    echo ""
}

# Main script
main() {
    echo ""
    echo "=========================================="
    echo "Pet Community Platform - Helm Deployment"
    echo "=========================================="
    echo ""
    
    # Parse arguments
    ACTION="${1:-install}"
    
    case $ACTION in
        install)
            check_prerequisites
            create_namespace
            validate_chart
            install_chart
            verify_deployment
            show_access_info
            ;;
        upgrade)
            check_prerequisites
            validate_chart
            upgrade_chart
            verify_deployment
            show_access_info
            ;;
        uninstall)
            log_info "Uninstalling Helm chart..."
            helm uninstall $RELEASE_NAME -n $NAMESPACE
            log_info "Helm chart uninstalled"
            ;;
        *)
            echo "Usage: $0 {install|upgrade|uninstall}"
            exit 1
            ;;
    esac
    
    echo ""
    log_info "Done!"
}

main "$@"
