---
id: intro
sidebar_position: 1
title: Introduction
slug: /
---

# Sercha Documentation

Self-hosted search across all your team's tools. Connect data sources like GitHub, Google Drive, and Notion, then search across everything from one API.

## How it works

1. **Connect** a data source via OAuth or API key
2. **Index** - Sercha fetches and indexes content for full-text and semantic search
3. **Search** - query across all sources from the REST API or Admin UI

<div className="feature-grid">
  <div className="connector-card">
    <div className="connector-card-body">
      <strong><a href="/docs/quickstart">Quickstart</a></strong>
      <span>Get Sercha running locally with Docker Compose.</span>
    </div>
  </div>
  <div className="connector-card">
    <div className="connector-card-body">
      <strong><a href="/docs/development">Development</a></strong>
      <span>Build from source with hot reload.</span>
    </div>
  </div>
  <div className="connector-card">
    <div className="connector-card-body">
      <strong><a href="/docs/configuration">Configuration</a></strong>
      <span>Environment variables and deployment options.</span>
    </div>
  </div>
  <div className="connector-card">
    <div className="connector-card-body">
      <strong><a href="/docs/indexing">Indexing Guide</a></strong>
      <span>Connect sources and index content via the API.</span>
    </div>
  </div>
  <div className="connector-card">
    <div className="connector-card-body">
      <strong><a href="/docs/search">Search Guide</a></strong>
      <span>Search indexed content with hybrid, text, or semantic modes.</span>
    </div>
  </div>
  <div className="connector-card">
    <div className="connector-card-body">
      <strong><a href="/api/sercha-core-api">API Reference</a></strong>
      <span>Full REST API documentation with interactive examples.</span>
    </div>
  </div>
  <div className="connector-card">
    <div className="connector-card-body">
      <strong><a href="/connectors">Connectors</a></strong>
      <span>GitHub, local filesystem, and more data sources.</span>
    </div>
  </div>
</div>

## Stack

| Component | Role |
|-----------|------|
| Sercha API | REST API for auth, sources, search |
| Worker | Background sync and indexing |
| PostgreSQL + pgvector | Metadata, users, vector search |
| OpenSearch | BM25 full-text search |

All components run in a single container for development. See [Configuration](/docs/configuration) for production deployments.
