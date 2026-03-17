---
id: intro
sidebar_position: 1
title: Sercha Core Overview
description: Team-based search infrastructure as a containerized service
---

# Sercha Core

Sercha Core is the server component of the Sercha search platform. It provides a REST API for team-based document search with hybrid search capabilities (BM25 + vector embeddings).

## What is Sercha Core?

While the [Sercha CLI](/cli/overview) is designed for individual use, Sercha Core is built for teams and organizations. It runs as a containerized service that multiple users can connect to through the REST API.

## Key Features

- **Team-based access control** - Users, teams, and role-based permissions
- **Hybrid search** - Combines BM25 text search with vector embeddings (when available)
- **Graceful degradation** - Works with text-only search if embeddings are unavailable
- **Multiple deployment modes** - Run as API server, background worker, or both
- **Connector ecosystem** - Sync documents from various sources (Google Drive, Dropbox, GitHub, etc.)

## Architecture

Sercha Core uses hexagonal architecture (ports and adapters) to maintain clean separation between business logic and infrastructure:

```
┌─────────────────────────────────────────────────────────────┐
│                      Driving Adapters                        │
│                    (HTTP API, Workers)                       │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                     Core Domain                              │
│        (Services, Entities, Business Logic)                  │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                     Driven Adapters                          │
│         (PostgreSQL, Redis, Vespa, Embedding APIs)           │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Modes

Sercha Core runs as a single container with multiple modes:

| Mode | Description |
|------|-------------|
| `api` | HTTP server for search and management |
| `worker` | Background sync and job processing |
| `all` | Both API and worker (default) |

## External Dependencies

### Required

| Service | Purpose |
|---------|---------|
| PostgreSQL | User, document, and source metadata |
| Vespa | Search engine (BM25 + vector) |

### Optional

| Service | Purpose |
|---------|---------|
| Redis | Session caching and job queue (improves performance at scale) |

### AI Services (Optional)

Sercha Core works without any AI services using pure keyword (BM25) search. AI services enable enhanced capabilities:

| Service | Purpose |
|---------|---------|
| Embedding API | Semantic search - find documents by meaning |
| LLM API | Query expansion, summarization |

See [AI Models](./models/overview) for supported providers and configuration.

## Next Steps

- [Quickstart](./quickstart) - Get Sercha Core running locally
- [Architecture](./architecture/overview) - Deep dive into system design
- [Examples](./examples/overview) - Deployment and integration examples
