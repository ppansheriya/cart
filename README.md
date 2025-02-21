# React Kubernetes Deployment Guide

This guide outlines the steps for setting up a React app locally, building it, creating a container registry, deploying the app to Kubernetes, and configuring Horizontal Pod Autoscaling (HPA).

## Step 1: Setup React App Locally

#### Clone/Download the repository
```bash
git clone https://github.com/ppansheriya/cart
```
#### Install npm packages:
```bash
npm i
```

#### Start the app:
```bash
npm run dev
```

#### Build the app to generate the dist directory:
```bash
npm run build
```

## Step 2: Install Docker (if you don't have Docker already)
Follow the official instructions to install Docker:
https://www.docker.com/get-started/

## Step 3: Create Container Registry and Upload the Image
Install doctl (DigitalOcean's CLI)
If you haven't installed doctl already, you can install it using the following:
```bash
brew install doctl
```

you may need to generate a new token from DigitalOcean's Dashboard under API > Generate
New Token.

#### Create the DigitalOcean Container Registry:
```bash
doctl registry create <your-registry-name>
```
Alternative way to create registry (DigitalOcean's Dashboard > Container Registry)

#### Validate Docker with the Registry:
```bash
doctl registry login
```

#### Build the Docker Image:
```bash
docker build --platform linux/amd64 -t registry.digitalocean.com/<your-registry-name>/cart-image:latest .
```

#### push registry
```bash
docker push registry.digitalocean.com/<your-registry-name>/cart-image:latest
```

Alternative: you can follow this article
https://docs.digitalocean.com/products/container-registry/getting-started/quickstart/

## Step 4: Deploy to Kubernetes

#### Create cluster (if you already have one, use one)
```bash
doctl kubernetes cluster create my-cluster --region sfo2 --node-pool "name=default-pool;count=2;size=s-2vcpu-4gb"
```

Alternative you can use DigitalOcean's Dashboard > Kubernetes > Create Cluster

#### Give cluster an access to registry
```bash
DigitalOcean's Dashboard > Container Registry > Settings > DigitalOcean Kubernetes integration
> Edit > Select Cluster > Save
```

#### deploy the app
```bash
kubectl apply -f deployment.yaml
```
Note: The Kubernetes deployment file contains the images that were pushed. Ensure the image
name matches.

#### check if pods are running
```bash
kubectl get pods
```

#### check if service are running
```bash
kubectl get services
```

Wait for the service's availability - Once the EXTERNAL-IP is available. Open new tab and hit
### http://<EXTERNAL-IP>

## Step 5: HPA -> Horizontal Pod Autoscaling

Kubernetes does not automatically provide HPA out of the box. You need to have the Metrics
Server installed and running in your cluster for HPA to work properly.

#### Check if Metric Server is installed
```bash
kubectl get deployment metrics-server -n kube-system
```
#### if not installed,
```bash 
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

#### check if the metric server is running,
```bash
kubectl get apiservice v1beta1.metrics.k8s.io
```

Modify the deployment.yaml to set resource limits and then run the command again.
```bash
kubectl apply -f deployment.yaml
```

Create a hpa.yaml file, which is the configuration for the HPA scaler that automatically adjusts
the number of pods based on CPU usage.

#### hpa.yaml(https://github.com/ppansheriya/cart/blob/main/hpa.yaml)

#### run this command hpa config
```bash
kubectl apply -f hpa.yaml
```

#### check the hpa
```bash
kubectl get hpa
kubectl get hpa -w (continous logs CPU usage)
```

Alternative way to install hpa using helm:
https://www.digitalocean.com/community/tutorials/how-to-configure-kubernetes-horizontal-p
od-autoscaler-using-metrics-server#step-1-install-metrics-server-via-helm

### Test Autoscalling
```bash
kubectl run -i --tty load-generator --image=busybox -- /bin/sh
```

it will open shell command
Run this command to stress the CPU
```bash
while true; do wget -q -Ohttp://cart-app-service.default.svc.cluster.local/; done
```
Stop the test: exit

#### Monitor the hpa on other terminal
```bash 
kubectl get hpa -w
```