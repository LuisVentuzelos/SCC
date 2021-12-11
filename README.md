# Viter API
Viter API is a RESTful API for managing the Viter App.

# Getting Started

## Running API Locally
### Start
npm run start

### Dev
npm run dev

### Linter
npm run lint

### Linter Fix 
npm run lint-fix

## Data Mock
### Mock data
docker exec -it scc-db-1 bash

cd /home/mongodb/seed

bash mongo_seed.sh

### Mock data in one command run 
docker exec scc-db-1 bash -c 'cd /home/mongodb/seed ; bash mongo_seed.sh' 

# Docker

## Docker Compose
### Docker compose build
docker-compose build

### Docker compose up
docker-compose up

### Docker compose up in detach mode
docker-compose up -d

## Deploy to Docker Hub

### Build your Docker image
docker build -t <your_username>/my-private-repo .

### Push your Docker image to Docker Hub
docker push <your_username>/my-private-repo

# Deployment

## Kubernetes
### Deploy to Kubernetes
kubectl apply -f deploy/k8s/

### scale api pods deployment
kubectl scale deployment api --replicas=3

### Get pods and logs
kubectl get pods
kubectl logs <pod_name>

## Minikube
### Minikube start
minikube start

### Minikube stop
minikube stop

### Minikube Dashboard
minikube dashboard

### Minikube expose services
minikube service --url db
minikube service --url api

### Minikube delete all
minikube delete --all

### Minikube and kubectl full deployment
minikube start
kubectl apply -f deploy/k8s/
minikube service --url api

## Azure Kubernetes Cluster
### Azure Deployment
az login

az aks get-credentials --resource-group DefaultResourceGroup-EUS --name viterCluster

kubectl apply -f deploy/k8s/

kubectl expose deployment api --type=LoadBalancer --name=viter-load-balancer

kubectl get service

### Azure Destroy Cluster
az aks delete --resource-group DefaultResourceGroup-EUS --name viterCluster --no-wait

