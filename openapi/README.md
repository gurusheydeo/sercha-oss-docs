# OpenAPI Documentation

This directory contains the OpenAPI/Swagger specification for sercha-core.

## Regenerating API Documentation

### Step 1: Generate swagger.yaml from sercha-core

In the `sercha-core` repository:

```bash
# Install swag if not already installed
go install github.com/swaggo/swag/cmd/swag@latest

# Generate swagger docs from code annotations
~/go/bin/swag init -g cmd/sercha-core/main.go -o docs --parseDependency --parseInternal

# Copy to sercha-oss-docs
cp docs/swagger.yaml ../sercha-oss-docs/openapi/
```

### Step 2: Generate MDX docs from swagger.yaml

In the `sercha-oss-docs` repository:

```bash
# Generate API reference docs
npx docusaurus gen-api-docs all

# Build to verify
npm run build
```

## Notes

- The swagger annotations are in `internal/adapters/driving/http/handlers.go`
- Main API info is in `cmd/sercha-core/main.go` (title, version, description)
- Generated MDX files go to `docs/core/api_reference/`
