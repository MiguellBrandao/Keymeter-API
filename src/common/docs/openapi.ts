export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Keymeter API",
    version: "1.0.0",
    description: "API documentation for Keymeter backend",
  },
  servers: [{ url: "http://localhost:3000" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      apiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-api-key",
      },
    },
  },
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: {
          "200": { description: "Healthy" },
          "503": { description: "Degraded" },
        },
      },
    },
    "/auth/signup": {
      post: {
        summary: "Sign up",
        responses: { "201": { description: "Created" } },
      },
    },
    "/auth/signin": {
      post: {
        summary: "Sign in",
        responses: { "200": { description: "OK" } },
      },
    },
    "/orgs": {
      post: {
        summary: "Create organization",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Created" } },
      },
    },
    "/orgs/my": {
      get: {
        summary: "List organizations of authenticated user",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "OK" } },
      },
    },
    "/orgs/{orgId}/member": {
      patch: {
        summary: "Change member role",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "orgId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } },
      },
    },
    "/orgs/{orgId}/member/{userId}": {
      delete: {
        summary: "Delete member from organization",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "path", name: "orgId", required: true, schema: { type: "string", format: "uuid" } },
          { in: "path", name: "userId", required: true, schema: { type: "string", format: "uuid" } },
        ],
        responses: { "200": { description: "OK" } },
      },
    },
    "/orgs/{orgId}/api-keys": {
      post: {
        summary: "Create API key",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "orgId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "201": { description: "Created" } },
      },
      get: {
        summary: "List API keys by organization",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "orgId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } },
      },
    },
    "/orgs/{orgId}/api-keys/rotate": {
      patch: {
        summary: "Rotate API key",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "orgId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } },
      },
    },
    "/orgs/{orgId}/api-keys/revoke": {
      patch: {
        summary: "Revoke API key",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "orgId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } },
      },
    },
    "/orgs/{orgId}/audit-logs": {
      get: {
        summary: "List audit logs by organization",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "orgId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } },
      },
    },
    "/orgs/{orgId}/usage": {
      get: {
        summary: "List usage by organization",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "orgId", required: true, schema: { type: "string", format: "uuid" } }],
        responses: { "200": { description: "OK" } },
      },
    },
    "/invites": {
      post: {
        summary: "Create invite",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Created" } },
      },
    },
    "/invites/accept": {
      get: {
        summary: "Accept invite",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "OK" } },
      },
    },
    "/invites/revoke": {
      post: {
        summary: "Revoke invite",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "OK" } },
      },
    },
    "/v1/events": {
      post: {
        summary: "Create event",
        security: [{ apiKeyAuth: [] }],
        responses: { "201": { description: "Created" } },
      },
      get: {
        summary: "List events",
        security: [{ apiKeyAuth: [] }],
        responses: { "200": { description: "OK" } },
      },
    },
  },
} as const

