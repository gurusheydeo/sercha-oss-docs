---
id: configuration
sidebar_position: 4
title: Configuration
---

# Configuration Reference

All configuration is via environment variables.

## Required

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string. Format: `postgres://user:pass@host:port/db?sslmode=disable` |
| `JWT_SECRET` | Secret for signing JWT tokens. Generate with `openssl rand -hex 32` |
| `MASTER_KEY` | Encryption key for stored secrets (OAuth tokens, API keys). Generate with `openssl rand -hex 32` |

## Server

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | HTTP server port |
| `RUN_MODE` | `all` | `all` (combined), `api` (API only), or `worker` (worker only) |
| `UI_BASE_URL` | `http://localhost:3000` | Admin UI URL (used for OAuth redirects) |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000` | Comma-separated allowed origins |

## Search backends

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENSEARCH_URL` | -- | OpenSearch URL for BM25 search. Example: `http://opensearch:9200` |
| `PGVECTOR_URL` | -- | PostgreSQL URL for vector search. Can be the same as `DATABASE_URL` |
| `PGVECTOR_DIMENSIONS` | `1536` | Vector dimensions. Must match your embedding model |

## AI providers (optional)

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key for embeddings and LLM |
| `OPENAI_BASE_URL` | Custom OpenAI-compatible endpoint |

These can also be configured at runtime via the [AI Settings API](/api/update-ai-settings).

## OAuth providers (optional)

Set these to enable OAuth connectors. See [Connectors](/connectors) for per-provider setup guides.

| Variable | Description |
|----------|-------------|
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret |

These can also be configured at runtime via the [Provider Config API](/api/save-provider-config).

## Worker

| Variable | Default | Description |
|----------|---------|-------------|
| `WORKER_CONCURRENCY` | `2` | Number of concurrent task processors |
| `WORKER_DEQUEUE_TIMEOUT` | `5` | Seconds to wait when queue is empty |
| `SCHEDULER_ENABLED` | `true` | Enable the task scheduler |
| `SCHEDULER_LOCK_REQUIRED` | `true` | Require distributed lock (for multi-worker deployments) |

## Database tuning

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_MAX_OPEN_CONNS` | `25` | Maximum open connections |
| `DB_MAX_IDLE_CONNS` | `5` | Maximum idle connections |
| `DB_CONN_MAX_LIFETIME_SEC` | `300` | Connection max lifetime in seconds |
| `DB_CONN_MAX_IDLE_SEC` | `60` | Connection max idle time in seconds |

## Redis (optional)

| Variable | Description |
|----------|-------------|
| `REDIS_URL` | Redis connection string. Format: `redis://host:port` or `redis://:password@host:port` |

When set, Redis is used for session storage, task queue, and distributed locks instead of PostgreSQL.

## Local filesystem connector

| Variable | Description |
|----------|-------------|
| `LOCALFS_ALLOWED_ROOTS` | Comma-separated paths the localfs connector can access. Example: `/data` |
