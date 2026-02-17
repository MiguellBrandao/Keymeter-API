import request from "supertest"
import { describe, expect, it } from "vitest"
import { app } from "../../app.js"
import { createOrg, createRunId, createUserAndToken } from "./helpers/scenario.js"

describe("API keys and events integration", () => {
  it("creates key, writes/reads events, rotates and revokes key", async () => {
    const runId = createRunId()
    const owner = await createUserAndToken({ runId, label: "owner" })
    const orgId = await createOrg(owner.accessToken, runId)

    const createApiKey = await request(app)
      .post(`/orgs/${orgId}/api-keys`)
      .set("Authorization", `Bearer ${owner.accessToken}`)
      .send({ name: "Integration Key", scopes: ["events:write", "events:read"] })
    expect(createApiKey.status).toBe(201)
    const rawApiKey = createApiKey.body.apiKey as string
    const keyPrefix = createApiKey.body.key.keyPrefix as string
    expect(rawApiKey).toContain(".")

    const createEvent = await request(app)
      .post("/v1/events")
      .set("x-api-key", rawApiKey)
      .send({
        type: "TRACK",
        properties: { source: "integration-test", action: "click" },
      })
    expect(createEvent.status).toBe(201)
    expect(createEvent.body.orgId).toBe(orgId)

    const findEvents = await request(app)
      .get("/v1/events")
      .set("x-api-key", rawApiKey)
      .query({ page: 1, limit: 20, type: "TRACK" })
    expect(findEvents.status).toBe(200)
    expect(Array.isArray(findEvents.body)).toBe(true)
    expect(findEvents.body.length).toBeGreaterThan(0)

    const rotate = await request(app)
      .patch(`/orgs/${orgId}/api-keys/rotate`)
      .set("Authorization", `Bearer ${owner.accessToken}`)
      .send({ keyPrefixOld: keyPrefix, scopes: ["events:write", "events:read"] })
    expect(rotate.status).toBe(200)
    const rotatedRawApiKey = rotate.body.apiKey as string
    const rotatedPrefix = rotate.body.key.keyPrefix as string

    const revokeApiKey = await request(app)
      .patch(`/orgs/${orgId}/api-keys/revoke`)
      .set("Authorization", `Bearer ${owner.accessToken}`)
      .send({ keyPrefix: rotatedPrefix })
    expect(revokeApiKey.status).toBe(200)
    expect(revokeApiKey.body.revokedAt).toBeTruthy()

    const eventsWithRevokedKey = await request(app)
      .get("/v1/events")
      .set("x-api-key", rotatedRawApiKey)
      .query({ page: 1, limit: 20 })
    expect(eventsWithRevokedKey.status).toBe(401)
  })
})

