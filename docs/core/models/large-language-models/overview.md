---
sidebar_position: 1
title: Large Language Models
---

# Large Language Models

Sercha Core can optionally use a Large Language Model (LLM) to enhance search and document understanding. This is entirely **optional** - Sercha Core works without an LLM using pure keyword search.

## What LLMs Enable

When configured, an LLM provides:

- **Query Rewriting**: Expands search queries with synonyms, fixes typos, and adds context
- **Summarization**: Creates summaries of indexed content
- **Query Understanding**: Better interpretation of natural language queries

## Architecture

LLM integration is a **driven port** in the hexagonal architecture. The core defines an `LLMService` interface, and adapters implement it for different providers.

```
┌─────────────────────────────────────────────────┐
│                  Core Domain                     │
│  ┌─────────────────────────────────────────┐    │
│  │           LLMService Port               │    │
│  │  - Generate(prompt)                     │    │
│  │  - Chat(messages)                       │    │
│  │  - RewriteQuery(query)                  │    │
│  │  - Summarize(content)                   │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
    ┌─────────┐  ┌─────────┐  ┌─────────┐
    │ OpenAI  │  │ Ollama  │  │  None   │
    │         │  │         │  │ (stub)  │
    └─────────┘  └─────────┘  └─────────┘
```

## Graceful Degradation

When no LLM is configured:
- Search falls back to pure keyword matching
- No query rewriting or summarization is available
- The application remains fully functional for basic search

## Supported Providers

| Provider | Models | Notes |
|----------|--------|-------|
| OpenAI | GPT-4o, GPT-4o-mini | Requires API key |
| Anthropic | Claude 3.x | Requires API key |
| Ollama | llama3, mistral, etc. | Local inference |
| None | — | Graceful degradation |

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LLM_PROVIDER` | - | Provider: `openai`, `anthropic`, `ollama` |
| `LLM_API_KEY` | - | API key for the provider |
| `LLM_MODEL` | - | Model name (e.g., `gpt-4o-mini`) |
| `LLM_BASE_URL` | - | Custom API endpoint (optional) |

### OpenAI Configuration

```bash
LLM_PROVIDER=openai
LLM_API_KEY=sk-...
LLM_MODEL=gpt-4o-mini
```

### Anthropic Configuration

```bash
LLM_PROVIDER=anthropic
LLM_API_KEY=sk-ant-...
LLM_MODEL=claude-3-haiku-20240307
```

### Ollama (Local) Configuration

```bash
LLM_PROVIDER=ollama
LLM_BASE_URL=http://localhost:11434
LLM_MODEL=llama3
```

## Key Source Files

| File | Description |
|------|-------------|
| `internal/core/ports/llm.go` | LLM service port interface |
| `internal/core/services/llm.go` | LLM orchestration service |
| `internal/adapters/driven/openai/llm.go` | OpenAI adapter |
| `internal/adapters/driven/ollama/llm.go` | Ollama adapter |
