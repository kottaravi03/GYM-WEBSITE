# Pet Community Platform - Deployment Guide

## Table of Contents
1. [Docker Setup](#docker-setup)
2. [Kubernetes Deployment](#kubernetes-deployment)
3. [Helm Deployment](#helm-deployment)
4. [Troubleshooting](#troubleshooting)

---

## Docker Setup

### Prerequisites
- Docker installed and running
- Docker Compose (optional, for local development)

### Build Docker Images

#### Build Backend Image
```bash
cd backend
docker build -t pet-community-backend:latest .
cd ..
```

#### Build Frontend Image
```bash
cd frontend
docker build -t pet-community-frontend:latest .
cd ..
```

#### Build Both Images
```bash
docker build -t pet-community-backend:latest ./backend
docker build -t pet-community-frontend:latest ./frontend
```

### Run with Docker Compose

```bash
docker-compose up -d
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (v1.20+)
- kubectl configured
- Helm 3.x installed
- Docker images pushed to registry

### Push Images to Registry

```bash
# Tag images
docker tag pet-community-backend:latest <registry>/pet-community-backend:latest
docker tag pet-community-frontend:latest <registry>/pet-community-frontend:latest

# Push to registry
docker push <registry>/pet-community-backend:latest
docker push <registry>/pet-community-frontend:latest
```

### Create Namespace
```bash
kubectl create namespace pet-community
```

### Deploy with kubectl (Raw Manifests)

```bash
# Apply all manifests
kubectl apply -f deploy/k8s/

# Verify deployment
kubectl get pods -n pet-community
kubectl get svc -n pet-community
```

---

## Helm Deployment

### Install Helm Chart

#### Basic Installation
```bash
helm install pet-community ./deploy/helm/pet-community \
  --namespace pet-community \
  --create-namespace
```

#### Installation with Custom Values
```bash
helm install pet-community ./deploy/helm/pet-community \
  --namespace pet-community \
  --create-namespace \
  -f deploy/helm/pet-community/values.yaml
```

#### Installation with Image Registry
```bash
helm install pet-community ./deploy/helm/pet-community \
  --namespace pet-community \
  --create-namespace \
  --set backend.image.repository=<registry>/pet-community-backend \
  --set frontend.image.repository=<registry>/pet-community-frontend \
  --set backend.image.tag=latest \
  --set frontend.image.tag=latest
```

### Verify Installation
```bash
# Check Helm release
helm list -n pet-community

# Check pods
kubectl get pods -n pet-community

# Check services
kubectl get svc -n pet-community

# Check ingress
kubectl get ingress -n pet-community
```

### Upgrade Release
```bash
helm upgrade pet-community ./deploy/helm/pet-community \
  --namespace pet-community \
  -f deploy/helm/pet-community/values.yaml
```

### Rollback Release
```bash
# View release history
helm history pet-community -n pet-community

# Rollback to previous version
helm rollback pet-community 1 -n pet-community
```

### Uninstall Release
```bash
helm uninstall pet-community -n pet-community
```

---

## Configuration

### Custom Values File

Create `custom-values.yaml`:

```yaml
replicaCount: 3

backend:
  image:
    repository: myregistry.azurecr.io/pet-community-backend
    tag: v1.0.0
  
  resources:
    limits:
      cpu: 1000m
      memory: 1Gi
    requests:
      cpu: 500m
      memory: 512Mi

frontend:
  image:
    repository: myregistry.azurecr.io/pet-community-frontend
    tag: v1.0.0
  
  env:
    REACT_APP_API_URL: https://api.petcommunity.com

ingress:
  enabled: true
  hosts:
    - host: petcommunity.com
      paths:
        - path: /
          pathType: Prefix

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
```

Deploy with custom values:
```bash
helm install pet-community ./deploy/helm/pet-community \
  -f custom-values.yaml \
  --namespace pet-community \
  --create-namespace
```

---

## Monitoring and Debugging

### View Pod Logs
```bash
# Backend logs
kubectl logs -n pet-community -l component=backend -f

# Frontend logs
kubectl logs -n pet-community -l component=frontend -f
```

### Port Forward
```bash
# Forward backend
kubectl port-forward -n pet-community svc/backend 8000:8000

# Forward frontend
kubectl port-forward -n pet-community svc/frontend 3000:3000
```

### Describe Resources
```bash
# Describe pod
kubectl describe pod -n pet-community <pod-name>

# Describe service
kubectl describe svc -n pet-community backend

# Describe deployment
kubectl describe deployment -n pet-community backend
```

### Check Events
```bash
kubectl get events -n pet-community --sort-by='.lastTimestamp'
```

---

## Troubleshooting

### Pods Not Starting

```bash
# Check pod status
kubectl get pods -n pet-community

# Describe pod for events
kubectl describe pod -n pet-community <pod-name>

# Check logs
kubectl logs -n pet-community <pod-name>
```

### Image Pull Errors

```bash
# Check image availability
docker pull <registry>/pet-community-backend:latest

# Create image pull secret
kubectl create secret docker-registry regcred \
  --docker-server=<registry> \
  --docker-username=<username> \
  --docker-password=<password> \
  -n pet-community

# Update values to use secret
helm upgrade pet-community ./deploy/helm/pet-community \
  --set imagePullSecrets[0].name=regcred \
  -n pet-community
```

### Service Not Accessible

```bash
# Check service endpoints
kubectl get endpoints -n pet-community

# Check ingress
kubectl describe ingress -n pet-community pet-community

# Test connectivity
kubectl run -it --rm debug --image=busybox --restart=Never -n pet-community -- sh
# Inside pod: wget http://backend:8000
```

### Persistent Issues

```bash
# Delete and redeploy
helm uninstall pet-community -n pet-community
kubectl delete namespace pet-community
helm install pet-community ./deploy/helm/pet-community \
  --namespace pet-community \
  --create-namespace
```

---

## Production Checklist

- [ ] Images pushed to private registry
- [ ] Resource limits configured
- [ ] Ingress configured with TLS
- [ ] Autoscaling enabled
- [ ] Health checks configured
- [ ] Logging configured
- [ ] Monitoring configured
- [ ] Backup strategy defined
- [ ] Security policies applied
- [ ] Network policies configured

---

## Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [React Production Build](https://create-react-app.dev/docs/production-build/)

---

**Last Updated:** 2024-01-15
