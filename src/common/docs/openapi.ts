export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Keymeter API",
    version: "1.0.0",
    description:
      "Multi-tenant analytics API with JWT auth, API key scopes, rate limit, audit logs, and daily usage aggregation.",
  },
  servers: [{ url: "http://localhost:3000" }],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Orgs" },
    { name: "Members" },
    { name: "Invites" },
    { name: "ApiKeys" },
    { name: "Events" },
    { name: "Audit" },
    { name: "Usage" },
  ],
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
        description: "Raw API key in the format `km_live_xxxxxxxx.secret`",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Invalid request body." },
          details: { type: "object", additionalProperties: true },
        },
        required: ["message"],
      },
      AuthTokenResponse: {
        type: "object",
        properties: {
          accessToken: { type: "string", example: "eyJhbGciOi..." },
        },
        required: ["accessToken"],
      },
      SignUpRequest: {
        type: "object",
        properties: {
          email: { type: "string", format: "email" },
          name: { type: "string", minLength: 2, maxLength: 30 },
          password: { type: "string", minLength: 6 },
        },
        required: ["email", "name", "password"],
      },
      SignInRequest: {
        type: "object",
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
        },
        required: ["email", "password"],
      },
      CreateOrgRequest: {
        type: "object",
        properties: { name: { type: "string", minLength: 2, maxLength: 80 } },
        required: ["name"],
      },
      OrgResponse: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
        },
        required: ["id", "name"],
      },
      InviteCreateRequest: {
        type: "object",
        properties: {
          orgId: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          role: { type: "string", enum: ["OWNER", "ADMIN", "MEMBER", "VIEWER"] },
        },
        required: ["orgId", "userId", "role"],
      },
      CreateApiKeyRequest: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 2, maxLength: 80 },
          scopes: {
            type: "array",
            minItems: 1,
            maxItems: 50,
            items: { type: "string" },
            example: ["events:write", "events:read"],
          },
        },
        required: ["name", "scopes"],
      },
      CreateApiKeyResponse: {
        type: "object",
        properties: {
          apiKey: { type: "string", example: "km_live_ab12CD34.very-secret-value" },
          key: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              orgId: { type: "string", format: "uuid" },
              name: { type: "string" },
              scopes: { type: "array", items: { type: "string" } },
              keyPrefix: { type: "string", example: "km_live_ab12CD34" },
              revokedAt: { type: "string", format: "date-time", nullable: true },
            },
            required: ["id", "orgId", "name", "scopes", "keyPrefix"],
          },
        },
        required: ["apiKey", "key"],
      },
      CreateEventRequest: {
        type: "object",
        description: "Requires scope `events:write`.",
        properties: {
          type: { type: "string", enum: ["TRACK", "IDENTIFY", "PAGE", "CUSTOM"] },
          properties: { type: "object", additionalProperties: true },
        },
        required: ["type", "properties"],
      },
      EventResponse: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          orgId: { type: "string", format: "uuid" },
          apiKeyId: { type: "string", format: "uuid" },
          type: { type: "string", enum: ["TRACK", "IDENTIFY", "PAGE", "CUSTOM"] },
          properties: { type: "object", additionalProperties: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      HealthResponse: {
        type: "object",
        properties: {
          status: { type: "string", enum: ["ok", "degraded"] },
          checks: {
            type: "object",
            properties: {
              db: { type: "string", enum: ["up", "down"] },
              redis: { type: "string", enum: ["up", "down"] },
            },
          },
          durationMs: { type: "number" },
          timestamp: { type: "string", format: "date-time" },
        },
      },
      UsageResponse: {
        type: "object",
        properties: {
          items: { type: "array", items: { type: "object", additionalProperties: true } },
          page: { type: "number" },
          limit: { type: "number" },
          total: { type: "number" },
          pages: { type: "number" },
          summary: {
            type: "object",
            properties: {
              eventsCount: { type: "number" },
            },
          },
        },
      },
      AuditResponse: {
        type: "object",
        properties: {
          items: { type: "array", items: { type: "object", additionalProperties: true } },
          page: { type: "number" },
          limit: { type: "number" },
          total: { type: "number" },
          pages: { type: "number" },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: "Unauthorized",
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
        },
      },
      Forbidden: {
        description: "Forbidden",
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
        },
      },
      Conflict: {
        description: "Conflict",
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
        },
      },
      ValidationError: {
        description: "Validation error",
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
        },
      },
      RateLimitExceeded: {
        description: "Rate limit exceeded",
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check for PostgreSQL and Redis",
        responses: {
          "200": {
            description: "Healthy",
            content: { "application/json": { schema: { $ref: "#/components/schemas/HealthResponse" } } },
          },
          "503": {
            description: "Degraded",
            content: { "application/json": { schema: { $ref: "#/components/schemas/HealthResponse" } } },
          },
        },
      },
    },
    "/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "Sign up user",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/SignUpRequest" } } },
        },
        responses: {
          "201": {
            description: "Created",
            content: { "application/json": { schema: { $ref: "#/components/schemas/AuthTokenResponse" } } },
          },
          "409": { $ref: "#/components/responses/Conflict" },
          "400": { $ref: "#/components/responses/ValidationError" },
        },
      },
    },
    "/auth/signin": {
      post: {
        tags: ["Auth"],
        summary: "Sign in user",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/SignInRequest" } } },
        },
        responses: {
          "200": {
            description: "OK",
            content: { "application/json": { schema: { $ref: "#/components/schemas/AuthTokenResponse" } } },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "400": { $ref: "#/components/responses/ValidationError" },
        },
      },
    },
    "/orgs": {
      post: {
        tags: ["Orgs"],
        summary: "Create organization",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateOrgRequest" } } },
        },
        responses: {
          "201": {
            description: "Created",
            content: { "application/json": { schema: { $ref: "#/components/schemas/OrgResponse" } } },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "400": { $ref: "#/components/responses/ValidationError" },
        },
      },
    },
    "/orgs/my": {
      get: {
        tags: ["Orgs"],
        summary: "List organizations of authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/OrgResponse" } },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/invites": {
      post: {
        tags: ["Invites"],
        summary: "Create invite",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/InviteCreateRequest" } } },
        },
        responses: {
          "201": { description: "Created" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "409": { $ref: "#/components/responses/Conflict" },
          "400": { $ref: "#/components/responses/ValidationError" },
        },
      },
    },
    "/invites/accept": {
      get: {
        tags: ["Invites"],
        summary: "Accept invite",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "query", name: "inviteId", required: true, schema: { type: "string", format: "uuid" } },
          { in: "query", name: "token", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "OK" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "409": { $ref: "#/components/responses/Conflict" },
        },
      },
    },
    "/invites/revoke": {
      post: {
        tags: ["Invites"],
        summary: "Revoke invite",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { inviteId: { type: "string", format: "uuid" } },
                required: ["inviteId"],
              },
            },
          },
        },
        responses: {
          "200": { description: "OK" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "409": { $ref: "#/components/responses/Conflict" },
        },
      },
    },
    "/orgs/{orgId}/member": {
      patch: {
        tags: ["Members"],
        summary: "Change member role",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "orgId", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: { type: "string", format: "uuid" },
                  role: { type: "string", enum: ["OWNER", "ADMIN", "MEMBER", "VIEWER"] },
                },
                required: ["userId", "role"],
              },
            },
          },
        },
        responses: {
          "200": { description: "OK" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { description: "Member not found" },
        },
      },
    },
    "/orgs/{orgId}/member/{userId}": {
      delete: {
        tags: ["Members"],
        summary: "Delete member from organization",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "path", name: "orgId", required: true, schema: { type: "string", format: "uuid" } },
          { in: "path", name: "userId", required: true, schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": { description: "OK" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { description: "Member not found" },
        },
      },
    },
    "/orgs/{orgId}/api-keys": {
      post: {
        tags: ["ApiKeys"],
        summary: "Create API key",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "orgId", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateApiKeyRequest" } } },
        },
        responses: {
          "201": {
            description: "Created",
            content: { "application/json": { schema: { $ref: "#/components/schemas/CreateApiKeyResponse" } } },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
      get: {
        tags: ["ApiKeys"],
        summary: "List API keys by organization",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "path", name: "orgId", required: true, schema: { type: "string", format: "uuid" } },
          { in: "query", name: "page", schema: { type: "number", default: 1 } },
          { in: "query", name: "limit", schema: { type: "number", default: 20, maximum: 100 } },
        ],
        responses: {
          "200": { description: "OK" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/orgs/{orgId}/api-keys/rotate": {
      patch: {
        tags: ["ApiKeys"],
        summary: "Rotate API key",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "orgId", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  keyPrefixOld: { type: "string", pattern: "^km_live_[A-Za-z0-9_-]{8}$" },
                  scopes: { type: "array", items: { type: "string" } },
                },
                required: ["keyPrefixOld", "scopes"],
              },
            },
          },
        },
        responses: {
          "200": { description: "OK" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "409": { $ref: "#/components/responses/Conflict" },
        },
      },
    },
    "/orgs/{orgId}/api-keys/revoke": {
      patch: {
        tags: ["ApiKeys"],
        summary: "Revoke API key",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "orgId", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { keyPrefix: { type: "string", pattern: "^km_live_[A-Za-z0-9_-]{8}$" } },
                required: ["keyPrefix"],
              },
            },
          },
        },
        responses: {
          "200": { description: "OK" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "409": { $ref: "#/components/responses/Conflict" },
        },
      },
    },
    "/v1/events": {
      post: {
        tags: ["Events"],
        summary: "Create event",
        description: "Requires API key scope `events:write`.",
        security: [{ apiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateEventRequest" } } },
        },
        responses: {
          "201": {
            description: "Created",
            content: { "application/json": { schema: { $ref: "#/components/schemas/EventResponse" } } },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "429": { $ref: "#/components/responses/RateLimitExceeded" },
        },
      },
      get: {
        tags: ["Events"],
        summary: "List events",
        description: "Requires API key scope `events:read`.",
        security: [{ apiKeyAuth: [] }],
        parameters: [
          { in: "query", name: "page", schema: { type: "number", default: 1 } },
          { in: "query", name: "limit", schema: { type: "number", default: 20, maximum: 100 } },
          { in: "query", name: "type", schema: { type: "string", enum: ["TRACK", "IDENTIFY", "PAGE", "CUSTOM"] } },
          { in: "query", name: "apiKeyId", schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/EventResponse" } },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "429": { $ref: "#/components/responses/RateLimitExceeded" },
        },
      },
    },
    "/orgs/{orgId}/audit-logs": {
      get: {
        tags: ["Audit"],
        summary: "List audit logs by organization",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "path", name: "orgId", required: true, schema: { type: "string", format: "uuid" } },
          { in: "query", name: "page", schema: { type: "number", default: 1 } },
          { in: "query", name: "limit", schema: { type: "number", default: 20, maximum: 100 } },
          {
            in: "query",
            name: "action",
            schema: {
              type: "string",
              enum: [
                "ORG_CREATED",
                "INVITE_CREATED",
                "INVITE_REVOKED",
                "MEMBER_ADDED",
                "MEMBER_REMOVED",
                "MEMBER_ROLE_CHANGED",
                "API_KEY_CREATED",
                "API_KEY_REVOKED",
                "API_KEY_ROTATED",
              ],
            },
          },
          { in: "query", name: "targetType", schema: { type: "string", enum: ["org", "invite", "member", "api_key"] } },
          { in: "query", name: "targetId", schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "OK",
            content: { "application/json": { schema: { $ref: "#/components/schemas/AuditResponse" } } },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/orgs/{orgId}/usage": {
      get: {
        tags: ["Usage"],
        summary: "List usage by organization",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "path", name: "orgId", required: true, schema: { type: "string", format: "uuid" } },
          { in: "query", name: "apiKeyId", schema: { type: "string", format: "uuid" } },
          { in: "query", name: "from", schema: { type: "string", format: "date-time" } },
          { in: "query", name: "to", schema: { type: "string", format: "date-time" } },
          { in: "query", name: "page", schema: { type: "number", default: 1 } },
          { in: "query", name: "limit", schema: { type: "number", default: 20, maximum: 100 } },
        ],
        responses: {
          "200": {
            description: "OK",
            content: { "application/json": { schema: { $ref: "#/components/schemas/UsageResponse" } } },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
  },
} as const

