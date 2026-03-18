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
│  │ EmbeddingService │    │      Vespa       │   │
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
- Vespa **stores and searches** vectors (integrated with BM25)

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

<!-- TODO: Add Core-specific adapter documentation and configuration examples -->

## Dimension Matching

The embedding model's dimensions **must match** the Vespa schema configuration:
- OpenAI `text-embedding-3-small` → 1536 dimensions
- Ollama `nomic-embed-text` → 768 dimensions
- Changing models requires re-indexing

## Configuration

<!-- TODO: Add detailed Core configuration examples -->

```bash
EMBEDDING_PROVIDER=openai
EMBEDDING_API_KEY=sk-...
EMBEDDING_MODEL=text-embedding-3-small

# Or for local inference
EMBEDDING_PROVIDER=ollama
EMBEDDING_BASE_URL=http://localhost:11434
EMBEDDING_MODEL=nomic-embed-text
```
