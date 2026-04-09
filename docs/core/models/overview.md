---
sidebar_position: 1
title: AI Models Overview
---

# AI Models Overview

Sercha Core supports optional integration with external AI models for enhanced search capabilities. These are entirely **optional** - Sercha Core works without any AI services using pure keyword (BM25) search.

## Model Categories

### [Embedding Models](./embedding-models/overview)

Embedding models convert text into numerical vectors, enabling semantic search. When configured, Sercha Core can find documents by meaning, not just keywords.

**Use cases:**
- Semantic search ("find documents about machine learning" matches "ML algorithms")
- Similar document discovery
- Hybrid search combining keywords and meaning

### [Large Language Models](./large-language-models/overview)

LLMs enhance query understanding and document processing. When configured, Sercha Core can rewrite queries and generate summaries.

**Use cases:**
- Query expansion (adding synonyms, fixing typos)
- Document summarization
- Natural language query understanding

## Graceful Degradation

Both model types are optional. Without them:

| Feature | With AI Models | Without AI Models |
|---------|---------------|-------------------|
| Keyword search | Yes | Yes |
| Semantic search | Yes | No |
| Query rewriting | Yes | No |
| Summarization | Yes | No |

Sercha Core degrades gracefully - core search functionality is always available.

## Configuration

AI services are configured via environment variables or the Admin API.

### Environment Variables

```bash
# Embedding Service
EMBEDDING_PROVIDER=openai    # openai | ollama | (empty for disabled)
EMBEDDING_API_KEY=sk-...
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_BASE_URL=         # Optional: custom endpoint

# LLM Service
LLM_PROVIDER=openai          # openai | anthropic | ollama | (empty for disabled)
LLM_API_KEY=sk-...
LLM_MODEL=gpt-4o-mini
LLM_BASE_URL=               # Optional: custom endpoint
```

### Admin API

Configure AI settings at runtime:

```bash
curl -X PUT http://localhost:8080/api/v1/settings/ai \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "embedding": {
      "provider": "openai",
      "model": "text-embedding-3-small"
    },
    "llm": {
      "provider": "openai",
      "model": "gpt-4o-mini"
    }
  }'
```

API keys are stored securely and managed separately via the secrets endpoint.

## Next Steps

- [Embedding Models](./embedding-models/overview) - Configure vector embeddings
- [Large Language Models](./large-language-models/overview) - Configure LLM integration
- [Capabilities](/core/architecture/capabilities) - Understanding search mode selection
