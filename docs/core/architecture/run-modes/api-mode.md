---
sidebar_position: 3
title: API Mode
description: HTTP server configuration and behavior
---

# API Mode

API mode runs only the HTTP server, making it ideal for horizontally scaled deployments behind a load balancer.

## Configuration

```yaml
services:
  sercha-api:
    image: sercha-core:latest
    environment:
      RUN_MODE: api
      PORT: 8080
      DATABASE_URL: postgres://...
      REDIS_URL: redis://...
      VESPA_URL: http://...
      JWT_SECRET: ${JWT_SECRET}
```

## What Runs

| Component | Status |
|-----------|--------|
| HTTP Server | Yes |
| REST API Endpoints | Yes |
| Authentication Middleware | Yes |
| Task Queue Consumer | No |
| Scheduler | No |

## Endpoints

API mode serves all REST endpoints:

| Category | Endpoints |
|----------|-----------|
| Health | `/health`, `/ready`, `/version` |
| Auth | `/api/v1/auth/login`, `/api/v1/auth/logout`, `/api/v1/auth/refresh` |
| Search | `/api/v1/search` |
| Sources | `/api/v1/sources/*` |
| Documents | `/api/v1/documents/*` |
| Users | `/api/v1/users/*`, `/api/v1/me` |
| Settings | `/api/v1/settings/*` |
| Admin | `/api/v1/admin/vespa/*` |

## Health Checks

Configure container health checks using the built-in endpoints:

```yaml
healthcheck:
  test: ["CMD", "wget", "-q", "--spider", "http://localhost:8080/health"]
  interval: 10s
  timeout: 5s
  retries: 3
```

| Endpoint | Purpose |
|----------|---------|
| `/health` | Basic liveness check |
| `/ready` | Readiness check (verifies database connection) |

## Scaling

API containers are stateless and can scale horizontally:

```yaml
services:
  sercha-api:
    image: sercha-core:latest
    environment:
      RUN_MODE: api
      # ... config
    deploy:
      replicas: 3
```

Place a load balancer in front of multiple API containers:

```
                    ┌─────────────────┐
                    │  Load Balancer  │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐         ┌────▼────┐         ┌────▼────┐
    │   API   │         │   API   │         │   API   │
    │ :8080   │         │ :8080   │         │ :8080   │
    └─────────┘         └─────────┘         └─────────┘
```

## Connection Pooling

When running multiple API containers, tune the database connection pool to avoid exhausting PostgreSQL connections:

```yaml
environment:
  DB_MAX_OPEN_CONNS: 10    # Per container
  DB_MAX_IDLE_CONNS: 3     # Per container
```

**Formula:** `Total DB connections = API replicas × DB_MAX_OPEN_CONNS`

For 5 API containers with `DB_MAX_OPEN_CONNS=10`, ensure PostgreSQL allows at least 50 connections.

## Graceful Shutdown

When the container receives `SIGTERM`:

1. Stop accepting new connections
2. Wait for in-flight requests to complete (up to 10 seconds)
3. Close database and Redis connections
4. Exit

## Key Source Files

| File | Description |
|------|-------------|
| `cmd/sercha-core/main.go` | Mode selection and initialization |
| `internal/adapters/driving/http/server.go` | HTTP server setup |
| `internal/adapters/driving/http/handlers.go` | Request handlers |
| `internal/adapters/driving/http/middleware.go` | Auth and logging middleware |

## Next Steps

- [Worker Mode](./worker-mode) - Background task processing
- [Scaling](./scaling) - Multi-instance deployment patterns
