---
id: search
sidebar_position: 6
title: Search Guide
---

# Search Guide

This guide covers how to search indexed content via the API. All examples assume you have indexed sources (see [Indexing Guide](/docs/indexing)) and a Bearer token.

## Basic search

[Search documents](/api/search-documents) with a query:

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/search \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "oauth callback"
  }'
```

Response:

```json title="Response"
{
  "query": "oauth callback",
  "mode": "hybrid",
  "results": [
    {
      "document_id": "...",
      "source_id": "...",
      "title": "internal/core/services/oauth.go",
      "path": "https://github.com/owner/repo/blob/main/...",
      "mime_type": "text/x-go",
      "snippet": "...",
      "score": 0.029,
      "indexed_at": "2026-04-09T11:34:26Z"
    }
  ],
  "total_count": 18,
  "took": 1219665417
}
```

## Search modes

Sercha supports three search modes:

| Mode | Description |
|------|-------------|
| `hybrid` | BM25 text search + vector semantic search, fused with RRF (default) |
| `text` | BM25 full-text search only (keyword matching) |
| `semantic` | Vector search only (meaning-based, requires an embedding model) |

Specify a mode:

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/search \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "how does authentication work",
    "mode": "text"
  }'
```

:::tip
`hybrid` mode gives the best results when an AI provider with embeddings is configured. If no embedding model is available, Sercha falls back to `text` mode automatically.
:::

## Response fields

Each result contains:

| Field | Description |
|-------|-------------|
| `document_id` | Unique document identifier |
| `source_id` | Which source this document belongs to |
| `title` | Document title or file path |
| `path` | URL or path to the original document |
| `mime_type` | Content type (e.g. `text/x-go`, `text/markdown`) |
| `snippet` | Relevant excerpt from the document |
| `score` | Relevance score (higher is better) |
| `indexed_at` | When the document was last indexed |

Top-level fields:

| Field | Description |
|-------|-------------|
| `query` | The query that was executed |
| `mode` | The search mode used |
| `total_count` | Total number of matching documents |
| `took` | Search duration in nanoseconds |

## Search analytics

Sercha tracks search queries for analytics.

[Search history](/api/get-search-history) shows recent queries:

```bash title="curl"
curl http://localhost:8080/api/v1/search/history \
  -H "Authorization: Bearer $TOKEN"
```

[Search metrics](/api/get-search-metrics) shows aggregate stats:

```bash title="curl"
curl http://localhost:8080/api/v1/search/metrics \
  -H "Authorization: Bearer $TOKEN"
```
