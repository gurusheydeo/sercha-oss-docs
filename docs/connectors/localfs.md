---
id: localfs
sidebar_position: 3
title: Local Filesystem
---

# Local Filesystem Connector

Indexes files from a directory on the server's filesystem. Useful for development and testing.

<div className="prereq-box">

**Prerequisites** - Before you start, make sure you have:
- A running Sercha instance ([Quickstart](/docs/quickstart) or [Development Setup](/docs/development))
- A directory mounted into the backend container

</div>

---

## 1. Configure allowed roots

The connector requires `LOCALFS_ALLOWED_ROOTS` to restrict which directories the connector can access.

In `examples/dev/docker-compose.yml`, this is preconfigured:

```yaml title="docker-compose.yml"
LOCALFS_ALLOWED_ROOTS: /data
```

With test documents mounted:

```yaml title="docker-compose.yml"
volumes:
  - ./test-docs:/data/test-docs:ro
```

## 2. Get an auth token

If you haven't already, create an admin account via [Initial Setup](/api/initial-setup):

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-password",
    "name": "Admin"
  }'
```

Then [log in](/api/user-login) to get a Bearer token:

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-password"
  }'
```

Copy the `token` field from the response and export it:

```bash title="Terminal"
export TOKEN=<paste token here>
```

## 3. Create a connection

The `api_key` field is the root directory path to index. [Create Connection](/api/create-connection):

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/connections \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Local Test Docs",
    "provider_type": "localfs",
    "api_key": "/data/test-docs"
  }'
```

Save the `id` from the response.

## 4. Browse containers and create a source

[List available containers](/api/list-containers) (subdirectories) for the connection:

```bash title="curl"
curl http://localhost:8080/api/v1/connections/{connection_id}/containers \
  -H "Authorization: Bearer $TOKEN"
```

Then [create a source](/api/create-source) selecting which subdirectories to index:

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/sources \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Docs",
    "provider_type": "localfs",
    "connection_id": "{connection_id}",
    "containers": [
      {"id": "/data/test-docs/sample", "name": "sample", "type": "directory"}
    ]
  }'
```

## 5. Trigger a sync

[Trigger a sync](/api/trigger-sync) to start indexing:

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/sources/{source_id}/sync \
  -H "Authorization: Bearer $TOKEN"
```

Check sync progress via [Sync State](/api/get-sync-state-for-source):

```bash title="curl"
curl http://localhost:8080/api/v1/sources/{source_id}/sync \
  -H "Authorization: Bearer $TOKEN"
```

---

## What gets indexed

<div className="feature-grid">
  <div className="feature-card">
    <strong>Text files</strong>
    <span>Code, markdown, plain text, and other text-based formats</span>
  </div>
  <div className="feature-card">
    <strong>File metadata</strong>
    <span>Path, size, and modification timestamps</span>
  </div>
</div>

Binary files are automatically skipped.

## Sync behavior

- **Initial sync**: Walks the directory tree and indexes all text files
- **Incremental sync**: Detects file changes via modification timestamps
- **No external auth**: Uses filesystem access directly
