---
id: overview
sidebar_position: 1
title: Examples Overview
description: Deployment and integration examples for Sercha Core
---

# Examples

Deployment and integration examples for Sercha Core.

## Available Examples

### Quickstart (Docker Compose)

The quickstart example provides a complete Docker Compose setup with:
- PostgreSQL database
- Vespa search engine
- Sercha Core API + Worker
- Optional Admin UI (via `--profile ui`)

See the [Quickstart Guide](/core/quickstart) for step-by-step instructions.

```bash
# Clone the repository
git clone https://github.com/sercha-oss/sercha-core.git
cd sercha-core/examples/quickstart

# Start with UI (recommended)
docker compose --profile ui up -d

# Or API-only
docker compose up -d
```

## Coming Soon

- **Helm Charts** - Kubernetes production deployment
- **Multinode** - Separate API and Worker containers
- **High Availability** - Load-balanced multi-instance deployment
