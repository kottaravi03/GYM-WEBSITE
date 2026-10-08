# Pet Community Platform - Deployment

This directory contains all deployment configurations for the Pet Community Platform using Docker, Kubernetes, and Helm.

## 📁 Directory Structure

```
deploy/
├── helm/
│   ├── pet-community/
│   │   ├── Chart.yaml              # Helm chart metadata
│   │   ├── values.yaml             # Default values
│   │   ├── values-dev.yaml         # Development environment
│   │   ├── values-prod.yaml        # Production environment
│   │   ├── templates/
│   │   │   ├── namespace.yaml
│   │   │   ├── backend-deployment.yaml
│   │   │   ├── backend-service.yaml
│   │   │   ├── frontend-deployment.yaml
│   │   │   ├── frontend-service.yaml
│   │   │   ├── ingress.yaml
│   │   │   └── hpa.yaml
│   │   └── charts/                 # Subchart dependencies
│   ├── deploy.sh                   # Linux/Mac deployment script
│   └── deploy.bat                  # Windows deployment script
└── README.md                       # This file
```

## 🚀 Quick Start

### Option 1: Docker Compose (Local Development)

```bash
# Build and start services
docker-compose up -d

# Access
# Frontend: http://localhost:3000
# Backend: http://localhost:8000

# Stop services
docker-compose down
```

### Option 2: Kubernetes with Helm

```bash
# Install Helm chart
helm install pet-community ./helm/pet-community \
  --namespace pet-community \
  --create-namespace

# Verify
kubectl get pods -n pet-community

# Access via port-forward
kubectl port-forward -n pet-community svc/frontend 3000:3000
```

### Option 3: Deployment Script

**Linux/Mac:**
```bash
bash ./helm/deploy.sh install
```

**Windows:**
```bash
.\helm\deploy.bat
```

## 📋 Helm Chart Details

### Chart Information
- **Name:** pet-community
- **Version:** 1.0.0
- **Type:** Application

### Components
- Backend (FastAPI)
- Frontend (React)
- Ingress
- Horizontal Pod Autoscaler

### Values Files

#### values.yaml (Default)
- 2 replicas
- Standard resource limits
- Ingress enabled
- Autoscaling enabled

#### values-dev.yaml (Development)
- 1 replica
- Minimal resources
- Ingress disabled
- Autoscaling disabled
- Always pull images

#### values-prod.yaml (Production)
- 3 replicas
- Higher resource limits
- Ingress enabled with TLS
- Autoscaling enabled (3-10 replicas)
- Pod anti-affinity
- Node selectors

## 🔧 Deployment Commands

### Install
```bash
# Default values
helm install pet-community ./helm/pet-community \
  --namespace pet-community \
  --create-namespace

# Development
helm install pet-community ./helm/pet-community \
  -f ./helm/pet-community/values-dev.yaml \
  --namespace pet-community \
  --create-namespace

# Production
helm install pet-community ./helm/pet-community \
  -f ./helm/pet-community/values-prod.yaml \
  --namespace pet-community \
  --create-namespace
```

### Upgrade
```bash
helm upgrade pet-community ./helm/pet-community \
  -f ./helm/pet-community/values-prod.yaml \
  --namespace pet-community
```

### Rollback
```bash
helm rollback pet-community 1 -n pet-community
```

### Uninstall
```bash
helm uninstall pet-community -n pet-community
```

## 📊 Monitoring

### Check Status
```bash
# Helm release
helm status pet-community -n pet-community

# Pods
kubectl get pods -n pet-community

# Services
kubectl get svc -n pet-community

# Ingress
kubectl get ingress -n pet-community
```

### View Logs
```bash
# Backend
kubectl logs -n pet-community -l component=backend -f

# Frontend
kubectl logs -n pet-community -l component=frontend -f
```

### Port Forward
```bash
# Frontend
kubectl port-forward -n pet-community svc/frontend 3000:3000

# Backend
kubectl port-forward -n pet-community svc/backend 8000:8000
```

## 🔐 Production Considerations

### Image Registry
Update image repositories in values-prod.yaml:
```yaml
backend:
  image:
    repository: your-registry.com/pet-community-backend
    tag: v1.0.0

frontend:
  image:
    repository: your-registry.com/pet-community-frontend
    tag: v1.0.0
```

### TLS/SSL
Configure ingress with TLS:
```yaml
ingress:
  tls:
    - secretName: pet-community-tls
      hosts:
        - petcommunity.com
```

### Resource Limits
Adjust based on your cluster:
```yaml
backend:
  resources:
    limits:
      cpu: 1000m
      memory: 1Gi
    requests:
      cpu: 500m
      memory: 512Mi
```

### Autoscaling
Configure HPA:
```yaml
autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
```

## 🐛 Troubleshooting

### Pods not starting
```bash
kubectl describe pod -n pet-community <pod-name>
kubectl logs -n pet-community <pod-name>
```

### Image pull errors
```bash
# Create image pull secret
kubectl create secret docker-registry regcred \
  --docker-server=your-registry.com \
  --docker-username=username \
  --docker-password=password \
  -n pet-community

# Update values to use secret
helm upgrade pet-community ./helm/pet-community \
  --set imagePullSecrets[0].name=regcred \
  -n pet-community
```

### Service not accessible
```bash
# Check endpoints
kubectl get endpoints -n pet-community

# Check ingress
kubectl describe ingress -n pet-community pet-community

# Test connectivity
kubectl run -it --rm debug --image=busybox --restart=Never -n pet-community -- sh
# Inside pod: wget http://backend:8000
```

## 📚 Additional Resources

- [Helm Documentation](https://helm.sh/docs/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [React Production Build](https://create-react-app.dev/docs/production-build/)

## 📝 Deployment Checklist

- [ ] Docker images built and tested
- [ ] Images pushed to registry
- [ ] Kubernetes cluster available
- [ ] kubectl configured
- [ ] Helm 3.x installed
- [ ] values-prod.yaml configured
- [ ] TLS certificates ready
- [ ] Ingress controller installed
- [ ] Resource quotas set
- [ ] Monitoring configured
- [ ] Backup strategy defined
- [ ] Security policies applied

## 🤝 Support

For issues or questions:
1. Check logs: `kubectl logs -n pet-community <pod-name>`
2. Describe resources: `kubectl describe pod -n pet-community <pod-name>`
3. Check events: `kubectl get events -n pet-community`
4. Review Helm values: `helm get values pet-community -n pet-community`

---

**Last Updated:** 2024-01-15  
**Helm Chart Version:** 1.0.0
