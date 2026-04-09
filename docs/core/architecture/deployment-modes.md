---
id: deployment-modes
sidebar_position: 4
title: Deployment Modes
description: Running Sercha Core as API, worker, or combined
---

# Deployment Modes

Sercha Core is a single container image that supports multiple deployment modes, enabling flexible scaling from simple single-container setups to distributed production clusters.

## Available Modes

| Mode | HTTP Server | Worker | Scheduler | Use Case |
|------|-------------|--------|-----------|----------|
| `all` | Yes | Yes | Yes | Development, simple deployments |
| `api` | Yes | No | No | Horizontally scaled API tier |
| `worker` | No | Yes | Yes | Dedicated background processing |

## Configuration

Set the mode via the `RUN_MODE` environment variable:

```yaml
services:
  sercha-api:
    image: sercha-core:latest
    environment:
      RUN_MODE: api
      # ... other config
```

## Quick Examples

### Combined Mode (Default)

```yaml
services:
  sercha:
    image: sercha-core:latest
    environment:
      DATABASE_URL: postgres://...
      REDIS_URL: redis://...
      OPENSEARCH_URL: http://...
      PGVECTOR_URL: postgres://...
    ports:
      - "8080:8080"
```

### Split Mode (API + Workers)

```yaml
services:
  sercha-api:
    image: sercha-core:latest
    environment:
      RUN_MODE: api
      # ...
    deploy:
      replicas: 3

  sercha-worker:
    image: sercha-core:latest
    environment:
      RUN_MODE: worker
      SCHEDULER_ENABLED: "true"
      # ...
    deploy:
      replicas: 2
```

## Detailed Documentation

For comprehensive guides on each mode:

- **[Run Modes Overview](./run-modes/overview)** - Mode comparison and architecture
- **[Configuration Reference](./run-modes/configuration)** - All environment variables
- **[API Mode](./run-modes/api-mode)** - HTTP server details and scaling
- **[Worker Mode](./run-modes/worker-mode)** - Task processing, scheduler, distributed locking
- **[Scaling Patterns](./run-modes/scaling)** - Multi-instance deployment strategies

## Next

- [Examples](../examples/overview) - Complete deployment examples
