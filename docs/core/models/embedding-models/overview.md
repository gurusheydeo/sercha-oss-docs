---
sidebar_position: 1
title: Embedding Models
---

# Embedding Models

Sercha Core can optionally use embedding models to enable semantic/vector search. This is **optional** - Sercha Core works without embeddings using pure keyword (BM25) search.

## What Embeddings Enable

When configured, embeddings provide:

- **Semantic Search**: Find documents by meaning, not just keywords
- **Similarity Matching**: Find related content even with different wording
- **Hybrid Search**: Combine keyword and semantic results

## Architecture

Embedding generation is a **driven port** in the hexagonal architecture. The core defines an `EmbeddingService` interface, and adapters implement it for different providers.

```
┌─────────────────────────────────────────────────┐
│                  Core Domain                     │
│  ┌──────────────────┐    ┌──────────────────┐   │
│  │ EmbeddingService │    │     pgvector     │   │
│  │  (generates)     │───▶│ (stores+searches)│   │
│  └──────────────────┘    └──────────────────┘   │
└─────────────────────────────────────────────────┘
         │
         ▼
   ┌───────────┐
   │  OpenAI   │
   │  Ollama   │
   └───────────┘
```

**Key distinction:**
- `EmbeddingService` **generates** vectors from text (inference)
- pgvector **stores and searches** vectors (PostgreSQL extension)
- OpenSearch provides **BM25 text search** (separate from vectors)

This separation allows different embedding providers with the same search backend.

## Graceful Degradation

When no embedding service is configured:
- Vector/semantic search is disabled
- Keyword (BM25) search remains fully functional
- Hybrid search falls back to keyword-only

## Supported Providers

| Provider | Models | Notes |
|----------|--------|-------|
| OpenAI | text-embedding-3-small, text-embedding-3-large | Requires API key |
| Ollama | nomic-embed-text, all-minilm | Local inference |
| None | — | Graceful degradation |

## Dimension Matching

The embedding model's dimensions **must match** the pgvector configuration (`PGVECTOR_DIMENSIONS`):
- OpenAI `text-embedding-3-small` → 1536 dimensions (default)
- Ollama `nomic-embed-text` → 768 dimensions
- Changing models requires re-indexing

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `EMBEDDING_PROVIDER` | - | Provider: `openai`, `ollama` |
| `EMBEDDING_API_KEY` | - | API key for the provider |
| `EMBEDDING_MODEL` | - | Model name |
| `EMBEDDING_BASE_URL` | - | Custom API endpoint (optional) |
| `PGVECTOR_DIMENSIONS` | `1536` | Vector dimensions (must match model) |

### OpenAI Configuration

```bash
EMBEDDING_PROVIDER=openai
EMBEDDING_API_KEY=sk-...
EMBEDDING_MODEL=text-embedding-3-small
PGVECTOR_DIMENSIONS=1536
```

### Ollama (Local) Configuration

```bash
EMBEDDING_PROVIDER=ollama
EMBEDDING_BASE_URL=http://localhost:11434
EMBEDDING_MODEL=nomic-embed-text
PGVECTOR_DIMENSIONS=768
```

## Key Source Files

| File | Description |
|------|-------------|
| `internal/core/ports/embedding.go` | Embedding service port interface |
| `internal/core/services/embedding.go` | Embedding orchestration service |
| `internal/adapters/driven/openai/embedding.go` | OpenAI adapter |
| `internal/adapters/driven/ollama/embedding.go` | Ollama adapter |
