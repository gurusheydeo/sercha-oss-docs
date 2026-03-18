import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api_reference/sercha-core-api",
    },
    {
      type: "category",
      label: "Admin",
      items: [
        {
          type: "doc",
          id: "api_reference/get-admin-statistics",
          label: "Get admin statistics",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Vespa",
      items: [
        {
          type: "doc",
          id: "api_reference/connect-to-vespa",
          label: "Connect to Vespa",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api_reference/vespa-health-check",
          label: "Vespa health check",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api_reference/get-vespa-status",
          label: "Get Vespa status",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Authentication",
      items: [
        {
          type: "doc",
          id: "api_reference/user-login",
          label: "User login",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api_reference/logout-user",
          label: "Logout user",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api_reference/refresh-token",
          label: "Refresh token",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Documents",
      items: [
        {
          type: "doc",
          id: "api_reference/get-document",
          label: "Get document",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api_reference/get-document-chunks",
          label: "Get document chunks",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Health",
      items: [
        {
          type: "doc",
          id: "api_reference/health-check",
          label: "Health check",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api_reference/readiness-check",
          label: "Readiness check",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api_reference/get-api-version",
          label: "Get API version",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Installations",
      items: [
        {
          type: "doc",
          id: "api_reference/list-installations",
          label: "List installations",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api_reference/delete-installation",
          label: "Delete installation",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api_reference/get-installation",
          label: "Get installation",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api_reference/list-containers",
          label: "List containers",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api_reference/test-installation",
          label: "Test installation",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Users",
      items: [
        {
          type: "doc",
          id: "api_reference/get-current-user",
          label: "Get current user",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api_reference/list-all-users",
          label: "List all users",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api_reference/create-user",
          label: "Create user",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api_reference/delete-user",
          label: "Delete user",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "OAuth",
      items: [
        {
          type: "doc",
          id: "api_reference/start-o-auth-authorization",
          label: "Start OAuth authorization",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api_reference/o-auth-callback",
          label: "OAuth callback",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Providers",
      items: [
        {
          type: "doc",
          id: "api_reference/list-providers",
          label: "List providers",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api_reference/delete-provider-config",
          label: "Delete provider config",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api_reference/get-provider-config",
          label: "Get provider config",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api_reference/save-provider-config",
          label: "Save provider config",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Search",
      items: [
        {
          type: "doc",
          id: "api_reference/search-documents",
          label: "Search documents",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Settings",
      items: [
        {
          type: "doc",
          id: "api_reference/get-settings",
          label: "Get settings",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api_reference/update-settings",
          label: "Update settings",
          className: "api-method put",
        },
      ],
    },
    {
      type: "category",
      label: "AI Settings",
      items: [
        {
          type: "doc",
          id: "api_reference/get-ai-settings",
          label: "Get AI settings",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api_reference/update-ai-settings",
          label: "Update AI settings",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "api_reference/get-ai-status",
          label: "Get AI status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api_reference/test-ai-connection",
          label: "Test AI connection",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Setup",
      items: [
        {
          type: "doc",
          id: "api_reference/initial-setup",
          label: "Initial setup",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Sources",
      items: [
        {
          type: "doc",
          id: "api_reference/list-sources",
          label: "List sources",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api_reference/create-source",
          label: "Create source",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api_reference/delete-source",
          label: "Delete source",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api_reference/get-source",
          label: "Get source",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api_reference/update-source",
          label: "Update source",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "api_reference/disable-source",
          label: "Disable source",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api_reference/list-source-documents",
          label: "List source documents",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api_reference/enable-source",
          label: "Enable source",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api_reference/update-source-selection",
          label: "Update source selection",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "api_reference/get-sync-state-for-source",
          label: "Get sync state for source",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api_reference/trigger-sync",
          label: "Trigger sync",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api_reference/list-sync-states",
          label: "List sync states",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
