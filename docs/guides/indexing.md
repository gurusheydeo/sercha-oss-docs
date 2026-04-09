---
id: indexing
sidebar_position: 5
title: Indexing Guide
---

# Indexing Guide

This guide walks through connecting data sources and indexing content via the API. All examples assume you have a running Sercha instance and a Bearer token (see [Quickstart](/docs/quickstart)).

## Authentication

Every API call requires a Bearer token. If you don't have one yet:

[Create an account](/api/initial-setup) (first time only):

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-password",
    "name": "Admin"
  }'
```

[Log in](/api/user-login):

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-password"
  }'
```

Export the `token` from the response:

```bash title="Terminal"
export TOKEN=<paste token here>
```

## Concepts

| Concept | Description |
|---------|-------------|
| **Provider** | A type of data source (GitHub, GitLab, etc.) |
| **Connection** | An authenticated link to a provider (OAuth tokens, API keys, etc.) |
| **Container** | A selectable unit within a connection (repo, space, etc.) |
| **Source** | A set of containers to index from a connection |
| **Sync** | The process of fetching and indexing content from a source |

## Step 1: Check available providers

[List Providers](/api/list-providers) shows which connectors are available and configured:

```bash title="curl"
curl http://localhost:8080/api/v1/providers \
  -H "Authorization: Bearer $TOKEN"
```

A provider must show `"configured": true` before you can create connections. See the [Connectors](/connectors) section for setup instructions per provider.

## Step 2: Create a connection

How you create a connection depends on the provider's auth method.

Start the OAuth flow via [Authorize](/api/start-o-auth-authorization):

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/oauth/github/authorize \
  -H "Authorization: Bearer $TOKEN"
```

Open the returned `authorization_url` in your browser. After authorization, the connection is created automatically.

### Verify

[List connections](/api/list-connections) to confirm:

```bash title="curl"
curl http://localhost:8080/api/v1/connections \
  -H "Authorization: Bearer $TOKEN"
```

Save the connection `id` for the next step.

## Step 3: Browse containers

[List containers](/api/list-containers) to see what's available to index:

```bash title="curl"
curl http://localhost:8080/api/v1/connections/{connection_id}/containers \
  -H "Authorization: Bearer $TOKEN"
```

For GitHub, containers are repositories. Other providers may use different container types (spaces, drives, projects, etc.).

## Step 4: Create a source

[Create a source](/api/create-source) with the containers you want to index:

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/sources \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Source",
    "provider_type": "github",
    "connection_id": "{connection_id}",
    "containers": [
      {"id": "owner/repo", "name": "repo", "type": "repository"}
    ]
  }'
```

Save the source `id` from the response.

## Step 5: Trigger a sync

[Trigger a sync](/api/trigger-sync) to start indexing:

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/sources/{source_id}/sync \
  -H "Authorization: Bearer $TOKEN"
```

Response:

```json title="Response"
{
  "source_id": "...",
  "status": "accepted",
  "task_id": "..."
}
```

## Step 6: Monitor progress

Check the [sync state](/api/get-sync-state-for-source) for a source:

```bash title="curl"
curl http://localhost:8080/api/v1/sources/{source_id}/sync \
  -H "Authorization: Bearer $TOKEN"
```

Or check [all sync states](/api/list-sync-states) at once:

```bash title="curl"
curl http://localhost:8080/api/v1/sources/sync-states \
  -H "Authorization: Bearer $TOKEN"
```

## Step 7: Verify indexed documents

[List documents](/api/list-source-documents) for a source:

```bash title="curl"
curl http://localhost:8080/api/v1/sources/{source_id}/documents \
  -H "Authorization: Bearer $TOKEN"
```

## Managing sources

### Disable / enable a source

[Disable](/api/disable-source) stops future syncs:

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/sources/{source_id}/disable \
  -H "Authorization: Bearer $TOKEN"
```

[Enable](/api/enable-source) resumes them:

```bash title="curl"
curl -X POST http://localhost:8080/api/v1/sources/{source_id}/enable \
  -H "Authorization: Bearer $TOKEN"
```

### Delete a source

[Delete a source](/api/delete-source) removes it and all its indexed documents:

```bash title="curl"
curl -X DELETE http://localhost:8080/api/v1/sources/{source_id} \
  -H "Authorization: Bearer $TOKEN"
```

### Delete a connection

Delete sources first, then [delete the connection](/api/delete-connection):

```bash title="curl"
curl -X DELETE http://localhost:8080/api/v1/connections/{connection_id} \
  -H "Authorization: Bearer $TOKEN"
```
