---
id: data-flow
sidebar_position: 3
title: Data Flow
description: How requests and data move through the system
---

# Data Flow

This document describes how data flows through Sercha Core for the two primary operations: search and sync.

## Search Flow

When a user submits a search query:

```mermaid
sequenceDiagram
    participant Client
    participant HTTP as HTTP Handler
    participant Auth as AuthMiddleware
    participant Search as SearchService
    participant Embed as EmbeddingService
    participant OS as OpenSearch
    participant PGV as pgvector

    Client->>HTTP: POST /api/v1/search
    HTTP->>Auth: Validate token
    Auth->>HTTP: AuthContext
    HTTP->>Search: Search(ctx, query, options)

    alt Hybrid Mode
        Search->>Embed: GenerateEmbedding(query)
        Embed-->>Search: []float32
        Search->>OS: BM25Search(query)
        Search->>PGV: VectorSearch(embedding)
        Search->>Search: Merge & rank results
    else Text-Only Mode
        Search->>OS: BM25Search(query)
    else Semantic-Only Mode
        Search->>Embed: GenerateEmbedding(query)
        Embed-->>Search: []float32
        Search->>PGV: VectorSearch(embedding)
    end

    Search-->>HTTP: SearchResult
    HTTP-->>Client: JSON response
```

### Search Modes

| Mode | When Used | Query Path |
|------|-----------|------------|
| `hybrid` | Both backends + embeddings available | OpenSearch BM25 + pgvector ANN |
| `text_only` | No embedding service or explicit | OpenSearch BM25 only |
| `semantic_only` | Explicit request with embeddings | pgvector ANN only |

## Sync Flow

When documents are synchronized from a source:

```mermaid
sequenceDiagram
    participant Scheduler
    participant Worker as Worker
    participant Sync as SyncService
    participant Connector as Connector
    participant Chunk as ChunkService
    participant Index as IndexService
    participant Store as DocumentStore
    participant OS as OpenSearch
    participant PGV as pgvector

    Scheduler->>Worker: Trigger sync job
    Worker->>Sync: SyncSource(sourceID)
    Sync->>Connector: FetchDocuments(since)
    Connector-->>Sync: []RawDocument

    loop Each Document
        Sync->>Chunk: ChunkDocument(doc)
        Chunk-->>Sync: []Chunk
        Sync->>Store: SaveDocument(doc)
        Sync->>Index: IndexChunks(chunks)
        Index->>OS: IndexText(chunks)
        Index->>PGV: IndexVectors(embeddings)
    end

    Sync-->>Worker: SyncResult
```

### Sync Stages

| Stage | Component | Action |
|-------|-----------|--------|
| 1. Fetch | Connector | Pull documents from source |
| 2. Normalize | Normalizer | Convert to standard format |
| 3. Chunk | ChunkService | Split into searchable units |
| 4. Store | DocumentStore | Persist metadata |
| 5. Index | IndexService | Add to search engine |

## Authentication Flow

Token-based authentication for API requests:

```mermaid
sequenceDiagram
    participant Client
    participant HTTP as HTTP Handler
    participant Auth as AuthService
    participant User as UserStore
    participant Session as SessionStore

    Client->>HTTP: POST /api/v1/auth/login
    HTTP->>Auth: Authenticate(email, password)
    Auth->>User: GetByEmail(email)
    User-->>Auth: User
    Auth->>Auth: Verify password
    Auth->>Session: Create session
    Session-->>Auth: Session
    Auth->>Auth: Generate JWT
    Auth-->>HTTP: LoginResponse
    HTTP-->>Client: {token, refresh_token}
```

## Error Handling

Errors flow up through the layers with context:

```
Adapter Error → Domain Error → Service Error → HTTP Error
```

| Layer | Error Type | Example |
|-------|------------|---------|
| Adapter | Infrastructure error | `sql.ErrNoRows` |
| Domain | Business error | `ErrUserNotFound` |
| Service | Wrapped with context | `"failed to get user: not found"` |
| HTTP | Status code + message | `404 {"error": "user not found"}` |

## Next

- [Deployment Modes](./deployment-modes) - API and Worker separation
