# Docker & Kubernetes Quick Start

## 🐳 Docker Quick Start

### Build Images
```bash
# Build backend
docker build -t pet-community-backend:latest ./backend

# Build frontend
docker build -t pet-community-frontend:latest ./frontend
```

### Run with Docker Compose
```bash
docker-compose up -d
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Stop Services
```bash
docker-compose down
```

---

## ☸️ Kubernetes Quick Start

### Prerequisites
- Kubernetes cluster running
- kubectl configured
- Helm 3.x installed

### Deploy with Helm

#### Development
```bash
helm install pet-community ./deploy/helm/pet-community \
  -f ./deploy/helm/pet-community/values-dev.yaml \
  --namespace pet-community \
  --create-namespace
```

#### Production
```bash
helm install pet-community ./deploy/helm/pet-community \
  -f ./deploy/helm/pet-community/values-prod.yaml \
  --namespace pet-community \
  --create-namespace
```

#### Using Deployment Script
```bash
# Linux/Mac
bash ./deploy/helm/deploy.sh install

# Windows
.\deploy\helm\deploy.bat
```

### Verify Deployment
```bash
kubectl get pods -n pet-community
kubectl get svc -n pet-community
kubectl get ingress -n pet-community
```

### Access Services

#### Port Forward
```bash
# Frontend
kubectl port-forward -n pet-community svc/frontend 3000:3000

# Backend
kubectl port-forward -n pet-community svc/backend 8000:8000
```

Then access:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

### View Logs
```bash
# Backend logs
kubectl logs -n pet-community -l component=backend -f

# Frontend logs
kubectl logs -n pet-community -l component=frontend -f
```

### Upgrade Deployment
```bash
helm upgrade pet-community ./deploy/helm/pet-community \
  -f ./deploy/helm/pet-community/values-prod.yaml \
  --namespace pet-community
```

### Uninstall
```bash
helm uninstall pet-community -n pet-community
```

---

## 📊 Helm Chart Structure

```
deploy/helm/pet-community/
├── Chart.yaml                 # Chart metadata
├── values.yaml               # Default values
├── values-dev.yaml           # Development values
├── values-prod.yaml          # Production values
└── templates/
    ├── namespace.yaml        # Kubernetes namespace
    ├── backend-deployment.yaml
    ├── backend-service.yaml
    ├── frontend-deployment.yaml
    ├── frontend-service.yaml
    ├── ingress.yaml
    └── hpa.yaml             # Auto-scaling
```

---

## 🔧 Common Commands

### Check Helm Release
```bash
helm list -n pet-community
helm status pet-community -n pet-community
helm get values pet-community -n pet-community
```

### Rollback
```bash
helm history pet-community -n pet-community
helm rollback pet-community 1 -n pet-community
```

### Debug
```bash
# Dry run
helm install pet-community ./deploy/helm/pet-community --dry-run --debug

# Lint chart
helm lint ./deploy/helm/pet-community

# Template rendering
helm template pet-community ./deploy/helm/pet-community
```

---

## 📝 Environment Variables

### Backend
- `PYTHONUNBUFFERED=1` - Unbuffered Python output

### Frontend
- `REACT_APP_API_URL` - Backend API URL

---

## 🚀 Production Deployment

1. **Build and push images**
   ```bash
   docker build -t registry.com/pet-community-backend:v1.0.0 ./backend
   docker push registry.com/pet-community-backend:v1.0.0
   ```

2. **Update values-prod.yaml**
   ```yaml
   backend:
     image:
       repository: registry.com/pet-community-backend
       tag: v1.0.0
   ```

3. **Deploy**
   ```bash
   helm install pet-community ./deploy/helm/pet-community \
     -f ./deploy/helm/pet-community/values-prod.yaml \
     --namespace pet-community \
     --create-namespace
   ```

4. **Verify**
   ```bash
   kubectl get all -n pet-community
   ```

---

## 🐛 Troubleshooting

### Pods not starting
```bash
kubectl describe pod -n pet-community <pod-name>
kubectl logs -n pet-community <pod-name>
```

### Image pull errors
```bash
# Check image availability
docker pull registry.com/pet-community-backend:v1.0.0

# Create image pull secret
kubectl create secret docker-registry regcred \
  --docker-server=registry.com \
  --docker-username=user \
  --docker-password=pass \
  -n pet-community
```

### Service not accessible
```bash
kubectl get endpoints -n pet-community
kubectl describe svc -n pet-community frontend
```

---

## 📚 Resources

- [Docker Docs](https://docs.docker.com/)
- [Kubernetes Docs](https://kubernetes.io/docs/)
- [Helm Docs](https://helm.sh/docs/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

---

**Ready to deploy? Start with Docker Compose or Helm! 🚀**
