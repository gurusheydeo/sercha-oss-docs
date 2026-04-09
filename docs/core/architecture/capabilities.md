---
sidebar_position: 5
title: Capabilities System
description: Understanding search modes and backend selection
---

# Capabilities System

Sercha Core uses a capability-based system to determine which search features are available based on configured backends. This enables graceful degradation when backends are unavailable and flexible deployment configurations.

## Search Modes

The system supports three search modes:

| Mode | Description | Requirements |
|------|-------------|--------------|
| `text_only` | BM25 keyword search | OpenSearch configured |
| `semantic_only` | Vector similarity search | pgvector + embedding provider |
| `hybrid` | Combined BM25 + vector search | Both backends configured |

## Backend Configuration

Search backends are configured via environment variables:

```yaml
environment:
  # BM25 text search (OpenSearch)
  OPENSEARCH_URL: http://opensearch:9200

  # Vector search (pgvector)
  PGVECTOR_URL: postgres://user:pass@host:5432/db
  PGVECTOR_DIMENSIONS: 1536  # Must match embedding model
```

## Capability Detection

At startup, Sercha Core probes configured backends and builds a capability map:

```mermaid
flowchart TD
    Start[Startup] --> CheckOS{OpenSearch URL set?}
    CheckOS -->|Yes| ProbeOS[Probe OpenSearch]
    CheckOS -->|No| NoOS[BM25 disabled]
    ProbeOS -->|Healthy| OS_OK[BM25 enabled]
    ProbeOS -->|Error| OS_Fail[BM25 disabled]

    Start --> CheckPGV{pgvector URL set?}
    CheckPGV -->|Yes| ProbePGV[Probe pgvector]
    CheckPGV -->|No| NoPGV[Vector disabled]
    ProbePGV -->|Healthy| PGV_OK[Vector enabled]
    ProbePGV -->|Error| PGV_Fail[Vector disabled]

    OS_OK --> Modes[Determine Search Modes]
    OS_Fail --> Modes
    PGV_OK --> Modes
    PGV_Fail --> Modes
    NoOS --> Modes
    NoPGV --> Modes
```

## API Endpoint

Query available capabilities via the API:

```bash
GET /api/v1/capabilities
```

Response:

```json
{
  "search_modes": ["text_only", "semantic_only", "hybrid"],
  "backends": {
    "bm25": {
      "enabled": true,
      "provider": "opensearch"
    },
    "vector": {
      "enabled": true,
      "provider": "pgvector"
    }
  }
}
```

## Graceful Degradation

The capability system enables graceful degradation:

| Scenario | Available Modes | Behavior |
|----------|-----------------|----------|
| Both backends healthy | All modes | Full functionality |
| OpenSearch only | `text_only` | Keyword search only |
| pgvector only | `semantic_only` | Vector search only |
| Neither configured | None | Search disabled, metadata queries work |

### Fallback Logic

When a search request specifies an unavailable mode:

1. If `hybrid` requested but only BM25 available → falls back to `text_only`
2. If `hybrid` requested but only vector available → falls back to `semantic_only`
3. If requested mode completely unavailable → returns error with available modes

## Architecture Integration

Capabilities integrate with the hexagonal architecture:

```
┌─────────────────────────────────────────────────────────┐
│                     Core Domain                          │
│  ┌────────────────┐      ┌─────────────────────────┐    │
│  │ CapabilityPort │      │     SearchService       │    │
│  │  (interface)   │◄────▶│ (uses capabilities to   │    │
│  └────────────────┘      │  route search requests) │    │
│                          └─────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
            │                           │
            ▼                           ▼
     ┌─────────────┐            ┌─────────────┐
     │ OpenSearch  │            │  pgvector   │
     │  Adapter    │            │   Adapter   │
     └─────────────┘            └─────────────┘
```

## Key Source Files

| File | Description |
|------|-------------|
| `internal/core/domain/capability.go` | Capability domain model |
| `internal/core/ports/capability.go` | Capability port interface |
| `internal/core/services/capability.go` | Capability detection service |
| `internal/adapters/driven/opensearch/` | OpenSearch BM25 adapter |
| `internal/adapters/driven/pgvector/` | pgvector adapter |

## Configuration Examples

### Full Search (Recommended)

Both BM25 and vector search enabled:

```yaml
environment:
  OPENSEARCH_URL: http://opensearch:9200
  PGVECTOR_URL: postgres://sercha:pass@postgres:5432/sercha
  PGVECTOR_DIMENSIONS: 1536
```

### BM25 Only (Minimal)

Text search without embeddings:

```yaml
environment:
  OPENSEARCH_URL: http://opensearch:9200
  # No PGVECTOR_URL - vector search disabled
```

### Vector Only

Semantic search without BM25:

```yaml
environment:
  PGVECTOR_URL: postgres://sercha:pass@postgres:5432/sercha
  PGVECTOR_DIMENSIONS: 1536
  # No OPENSEARCH_URL - BM25 disabled
```

## Next Steps

- [Configuration Reference](./run-modes/configuration) - Full environment variables
- [Data Flow](./data-flow) - How search requests are processed
- [Embedding Models](/core/models/embedding-models/overview) - Configure vector embeddings
