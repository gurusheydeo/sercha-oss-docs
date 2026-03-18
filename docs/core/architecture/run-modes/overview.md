---
sidebar_position: 1
title: Run Modes Overview
description: Understanding API, Worker, and combined modes
---

# Run Modes Overview

Sercha Core supports three run modes, enabling flexible deployment from single-container development to distributed production clusters.

## Mode Comparison

| Mode | HTTP Server | Task Queue | Scheduler | Use Case |
|------|-------------|------------|-----------|----------|
| `all` | Yes | Yes | Yes | Development, simple deployments |
| `api` | Yes | No | No | Horizontally scaled API tier |
| `worker` | No | Yes | Yes | Dedicated background processing |

## Configuration

Set the run mode via the `RUN_MODE` environment variable:

```yaml
services:
  sercha-api:
    image: sercha-core:latest
    environment:
      RUN_MODE: api
      # ... other config
```

| Value | Description |
|-------|-------------|
| `all` | Combined mode (default) |
| `api` | HTTP server only |
| `worker` | Background processing only |

## Architecture

```mermaid
flowchart TB
    subgraph "Combined (RUN_MODE=all)"
        A1[HTTP Server] --> S1[Services]
        W1[Worker] --> S1
        S1 --> D1[(PostgreSQL)]
        S1 --> V1[(Vespa)]
    end

    subgraph "Split Deployment"
        LB[Load Balancer] --> A2a[API Container]
        LB --> A2b[API Container]
        A2a --> S2[Services]
        A2b --> S2

        W3a[Worker Container] --> Q[(Redis Queue)]
        W3b[Worker Container] --> Q
        Q --> S2
        S2 --> D2[(PostgreSQL)]
        S2 --> V2[(Vespa)]
    end
```

## Shared Infrastructure

All containers connect to the same backing services:

| Service | Purpose | Required |
|---------|---------|----------|
| PostgreSQL | User data, documents, metadata | Yes |
| Vespa | Search index | Yes |
| Redis | Sessions, queue, distributed locks | No (falls back to PostgreSQL) |

## Graceful Shutdown

All modes respond to container stop signals:

1. Container runtime sends `SIGTERM`
2. In-flight requests complete (API) or current task finishes (Worker)
3. Connections drain within 30 seconds
4. Container exits cleanly

## Next Steps

- [Configuration](./configuration) - Environment variables reference
- [API Mode](./api-mode) - HTTP server configuration
- [Worker Mode](./worker-mode) - Task processing and scheduling
- [Scaling](./scaling) - Multi-instance deployment patterns
