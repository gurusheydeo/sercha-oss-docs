---
sidebar_position: 2
title: Configuration Reference
description: Environment variables for Sercha Core
---

# Configuration Reference

All Sercha Core configuration is done via environment variables.

## Core Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `RUN_MODE` | `all` | Run mode: `all`, `api`, or `worker` |
| `PORT` | `8080` | HTTP server port (API and combined modes) |
| `JWT_SECRET` | - | Secret for signing JWT tokens (required) |
| `TEAM_ID` | `default-team` | Team identifier for multi-tenant setups |

## Database

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | - | PostgreSQL connection string (required) |
| `DB_MAX_OPEN_CONNS` | `25` | Maximum open connections |
| `DB_MAX_IDLE_CONNS` | `5` | Maximum idle connections |
| `DB_CONN_MAX_LIFETIME_SEC` | `300` | Connection max lifetime in seconds |
| `DB_CONN_MAX_IDLE_SEC` | `60` | Connection max idle time in seconds |

### Connection String Format

```
postgres://user:password@host:port/database?sslmode=disable
```

## Redis (Optional)

| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_URL` | - | Redis connection string (optional) |

When `REDIS_URL` is set, Sercha uses Redis for:
- Session storage (faster than PostgreSQL)
- Task queue (supports distributed workers)
- Distributed locks (scheduler coordination)

When not set, PostgreSQL is used for all of the above.

### Connection String Format

```
redis://host:port
redis://:password@host:port
```

## Search Backends (Optional)

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENSEARCH_URL` | - | OpenSearch URL for BM25 search |
| `PGVECTOR_URL` | - | PostgreSQL URL for vector search (can be same as DATABASE_URL) |
| `PGVECTOR_DIMENSIONS` | `1536` | Vector dimensions (default matches OpenAI ada-002) |

## Worker Settings

These apply to `worker` and `all` modes:

| Variable | Default | Description |
|----------|---------|-------------|
| `WORKER_CONCURRENCY` | `2` | Number of concurrent task processors |
| `WORKER_DEQUEUE_TIMEOUT` | `5` | Seconds to wait when queue is empty |

## Scheduler Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `SCHEDULER_ENABLED` | `true` | Enable the task scheduler |
| `SCHEDULER_LOCK_REQUIRED` | `true` | Require distributed lock for scheduling |

When running multiple worker containers, `SCHEDULER_LOCK_REQUIRED=true` ensures only one worker schedules tasks per cycle, preventing duplicates.

## Example Configurations

### Development (Combined Mode)

```yaml
environment:
  DATABASE_URL: postgres://sercha:dev@postgres:5432/sercha?sslmode=disable
  JWT_SECRET: dev-secret-change-in-production
  MASTER_KEY: dev-master-key-change-in-production
  OPENSEARCH_URL: http://opensearch:9200
  PGVECTOR_URL: postgres://sercha:dev@postgres:5432/sercha?sslmode=disable
```

### Production API

```yaml
environment:
  RUN_MODE: api
  PORT: 8080
  DATABASE_URL: postgres://sercha:${DB_PASSWORD}@db.example.com:5432/sercha
  REDIS_URL: redis://redis.example.com:6379
  OPENSEARCH_URL: http://opensearch.example.com:9200
  PGVECTOR_URL: postgres://sercha:${DB_PASSWORD}@db.example.com:5432/sercha
  JWT_SECRET: ${JWT_SECRET}
  MASTER_KEY: ${MASTER_KEY}
  DB_MAX_OPEN_CONNS: 50
  DB_MAX_IDLE_CONNS: 10
```

### Production Worker

```yaml
environment:
  RUN_MODE: worker
  DATABASE_URL: postgres://sercha:${DB_PASSWORD}@db.example.com:5432/sercha
  REDIS_URL: redis://redis.example.com:6379
  OPENSEARCH_URL: http://opensearch.example.com:9200
  PGVECTOR_URL: postgres://sercha:${DB_PASSWORD}@db.example.com:5432/sercha
  JWT_SECRET: ${JWT_SECRET}
  MASTER_KEY: ${MASTER_KEY}
  WORKER_CONCURRENCY: 4
  SCHEDULER_ENABLED: "true"
  SCHEDULER_LOCK_REQUIRED: "true"
```

## Next Steps

- [API Mode](./api-mode) - HTTP server details
- [Worker Mode](./worker-mode) - Task processing and scheduling
- [Scaling](./scaling) - Multi-instance deployment patterns
