---
id: layers
sidebar_position: 2
title: System Layers
description: Layer organization and dependency rules
---

# System Layers

Sercha Core is organized into four distinct layers, each with specific responsibilities and dependency rules.

## Layer Overview

```mermaid
graph TB
    subgraph UI["Driving Layer"]
        HTTP[HTTP Handlers]
        Worker[Worker Jobs]
    end

    subgraph App["Application Layer"]
        Auth[AuthService]
        Search[SearchService]
        Source[SourceService]
        Sync[SyncService]
        User[UserService]
        Doc[DocumentService]
        Index[IndexService]
        Chunk[ChunkService]
    end

    subgraph Domain["Domain Layer"]
        Entities[Entities]
        DPorts[Driving Ports]
        IPorts[Driven Ports]
    end

    subgraph Infra["Infrastructure Layer"]
        PG[PostgreSQL + pgvector]
        OS[OpenSearch Adapter]
    end

    subgraph Optional["Optional Adapters"]
        Redis[Redis Adapter]
        Embed[Embedding Adapter]
        LLM[LLM Adapter]
    end

    UI --> App
    App --> Domain
    Infra --> Domain
```

## Layer Details

### 1. Driving Layer (Adapters)

**Location:** `internal/adapters/driving/`

External interfaces that call into the application:

| Component | Purpose |
|-----------|---------|
| `http/` | REST API handlers, middleware, routing |
| `worker/` | Background job processing |

**Dependencies:** Can import from Application and Domain layers.

### 2. Application Layer (Services)

**Location:** `internal/core/services/`

Business logic orchestration:

| Service | Responsibility |
|---------|---------------|
| `AuthService` | Login, logout, token management |
| `SearchService` | Query execution, result ranking |
| `SourceService` | Data source CRUD and configuration |
| `SyncService` | Document synchronization |
| `UserService` | User management |
| `DocumentService` | Document CRUD |
| `IndexService` | Search index management |
| `ChunkService` | Document chunking |

**Dependencies:** Can import from Domain layer only.

### 3. Domain Layer (Core)

**Location:** `internal/core/domain/` and `internal/core/ports/`

Pure business entities and interface definitions:

| Component | Contents |
|-----------|----------|
| `domain/` | User, Document, Source, Chunk, Session, etc. |
| `ports/driving/` | Service interfaces |
| `ports/driven/` | Infrastructure interfaces |

**Dependencies:** No external imports (pure Go only).

### 4. Infrastructure Layer (Driven Adapters)

**Location:** `internal/adapters/driven/`

External system integrations:

**Required:**

| Adapter | Implements |
|---------|------------|
| `postgres/` | UserStore, DocumentStore, SourceStore, SessionStore, JobQueue |

**Optional (Search):**

| Adapter | Implements |
|---------|------------|
| `opensearch/` | SearchEngine (BM25 text search) |
| `pgvector/` | VectorIndex (semantic search) |

**Optional (Infrastructure):**

| Adapter | Implements |
|---------|------------|
| `redis/` | SessionStore, JobQueue (overrides PostgreSQL at scale) |
| `ai/` | EmbeddingService, LLMService |

**Dependencies:** Can import from Domain layer only.

## Dependency Matrix

| Layer | Can Import From |
|-------|-----------------|
| Driving | Application, Domain |
| Application | Domain |
| Domain | Nothing (pure Go) |
| Infrastructure | Domain |

## Directory Structure

```
internal/
├── adapters/
│   ├── driving/
│   │   └── http/              # REST API
│   └── driven/
│       ├── postgres/          # Database adapter (required)
│       ├── opensearch/        # BM25 search adapter (optional)
│       ├── pgvector/          # Vector search adapter (optional)
│       ├── redis/             # Cache/queue adapter (optional)
│       └── ai/                # Embedding & LLM adapters (optional)
├── core/
│   ├── domain/                # Entities and errors
│   ├── ports/
│   │   ├── driving/           # Service interfaces
│   │   └── driven/            # Infrastructure interfaces
│   └── services/              # Business logic
└── app/                       # Application container
```

## Next

- [Data Flow](./data-flow) - Request/response patterns
- [Deployment Modes](./deployment-modes) - Running API vs Worker
