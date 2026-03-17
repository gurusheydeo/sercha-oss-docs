---
sidebar_position: 5
title: Scaling Patterns
description: Multi-instance deployment strategies
---

# Scaling Patterns

This guide covers deployment patterns for scaling Sercha Core from development to production.

## Pattern 1: Combined Mode

Single container runs everything. Simplest deployment.

```
┌─────────────────────────────┐
│  sercha-core (RUN_MODE=all) │
│  ┌───────────┐ ┌─────────┐  │
│  │ HTTP API  │ │ Worker  │  │
│  └───────────┘ └─────────┘  │
└─────────────────────────────┘
```

**docker-compose.yml:**
```yaml
services:
  sercha:
    image: sercha-core:latest
    environment:
      DATABASE_URL: postgres://sercha:password@postgres:5432/sercha
      REDIS_URL: redis://redis:6379
      VESPA_URL: http://vespa:19071
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "8080:8080"
```

**Best for:** Development, small teams, low traffic.

## Pattern 2: Split API + Worker

Separate containers for independent scaling.

```
┌────────────┐  ┌────────────┐
│  API (x3)  │  │  API (x3)  │
└─────┬──────┘  └─────┬──────┘
      │               │
      └───────┬───────┘
              │
        ┌─────▼─────┐
        │   Redis   │
        └─────┬─────┘
              │
      ┌───────┴───────┐
      │               │
┌─────▼─────┐   ┌─────▼─────┐
│ Worker(x2)│   │ Worker(x2)│
└───────────┘   └───────────┘
```

**docker-compose.yml:**
```yaml
services:
  sercha-api:
    image: sercha-core:latest
    environment:
      RUN_MODE: api
      PORT: 8080
      DATABASE_URL: postgres://sercha:password@postgres:5432/sercha
      REDIS_URL: redis://redis:6379
      VESPA_URL: http://vespa:19071
      JWT_SECRET: ${JWT_SECRET}
      DB_MAX_OPEN_CONNS: 10
    deploy:
      replicas: 3
    ports:
      - "8080:8080"

  sercha-worker:
    image: sercha-core:latest
    environment:
      RUN_MODE: worker
      DATABASE_URL: postgres://sercha:password@postgres:5432/sercha
      REDIS_URL: redis://redis:6379
      VESPA_URL: http://vespa:19071
      JWT_SECRET: ${JWT_SECRET}
      WORKER_CONCURRENCY: 4
      SCHEDULER_ENABLED: "true"
      SCHEDULER_LOCK_REQUIRED: "true"
    deploy:
      replicas: 2
```

**Best for:** Production, high traffic, large document volumes.

## Pattern 3: Dedicated Scheduler

One scheduler container, multiple task processors.

```
┌────────────────┐
│   Scheduler    │ ◄── Only one schedules
│  Worker (x1)   │
└───────┬────────┘
        │
        ▼
┌───────────────┐
│  Task Queue   │
└───────┬───────┘
        │
┌───────┴───────┐
│               │
▼               ▼
┌─────────┐   ┌─────────┐
│ Worker  │   │ Worker  │ ◄── Many process
│  (x1)   │   │  (x1)   │
└─────────┘   └─────────┘
```

**docker-compose.yml:**
```yaml
services:
  # Scheduler + task processor
  sercha-scheduler:
    image: sercha-core:latest
    environment:
      RUN_MODE: worker
      SCHEDULER_ENABLED: "true"
      WORKER_CONCURRENCY: 2
      # ... other config

  # Task processors only (no scheduler)
  sercha-worker:
    image: sercha-core:latest
    environment:
      RUN_MODE: worker
      SCHEDULER_ENABLED: "false"
      WORKER_CONCURRENCY: 4
      # ... other config
    deploy:
      replicas: 3
```

**Best for:** When you want explicit control over scheduling.

## Load Balancing

For multiple API containers, use a load balancer:

**nginx.conf:**
```nginx
upstream sercha_api {
    server sercha-api-1:8080;
    server sercha-api-2:8080;
    server sercha-api-3:8080;
}

server {
    listen 80;

    location / {
        proxy_pass http://sercha_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Connection Pool Sizing

When scaling horizontally, adjust database connection pools:

| Deployment | API Replicas | `DB_MAX_OPEN_CONNS` | Total Connections |
|------------|--------------|---------------------|-------------------|
| Small | 1 | 25 | 25 |
| Medium | 3 | 10 | 30 |
| Large | 10 | 5 | 50 |

**Rule:** `API replicas × DB_MAX_OPEN_CONNS + Worker replicas × DB_MAX_OPEN_CONNS < PostgreSQL max_connections`

## Redis Requirements

For split deployments, Redis is strongly recommended:

| Feature | Without Redis | With Redis |
|---------|---------------|------------|
| Session storage | PostgreSQL (slower) | Redis (faster) |
| Task queue | PostgreSQL (single worker) | Redis Streams (multi-worker) |
| Distributed lock | PostgreSQL advisory (limited) | Redis SETNX (robust) |

## Health Checks

Configure health checks for orchestration:

```yaml
services:
  sercha-api:
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:8080/health"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
```

## Kubernetes Example

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sercha-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sercha-api
  template:
    metadata:
      labels:
        app: sercha-api
    spec:
      containers:
      - name: sercha
        image: sercha-core:latest
        env:
        - name: RUN_MODE
          value: "api"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: sercha-secrets
              key: database-url
        ports:
        - containerPort: 8080
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sercha-worker
spec:
  replicas: 2
  selector:
    matchLabels:
      app: sercha-worker
  template:
    metadata:
      labels:
        app: sercha-worker
    spec:
      containers:
      - name: sercha
        image: sercha-core:latest
        env:
        - name: RUN_MODE
          value: "worker"
        - name: SCHEDULER_ENABLED
          value: "true"
        - name: SCHEDULER_LOCK_REQUIRED
          value: "true"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: sercha-secrets
              key: database-url
```

## Next Steps

- [Configuration](./configuration) - Full environment variables reference
- [API Mode](./api-mode) - HTTP server details
- [Worker Mode](./worker-mode) - Task processing details
