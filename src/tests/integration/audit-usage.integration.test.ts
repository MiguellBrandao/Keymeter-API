import request from "supertest"
import { describe, expect, it } from "vitest"
import { app } from "../../app.js"
import { createInviteAndCaptureToken, createOrg, createRunId, createUserAndToken } from "./helpers/scenario.js"

describe("Audit and usage integration", () => {
  it("records usage and audit actions", async () => {
    const runId = createRunId()
    const owner = await createUserAndToken({ runId, label: "owner" })
    const member = await createUserAndToken({ runId, label: "member" })
    const orgId = await createOrg(owner.accessToken, runId)

    const invite = await createInviteAndCaptureToken({
      ownerToken: owner.accessToken,
      orgId,
      userId: member.userId,
      role: "MEMBER",
    })
    expect(invite.response.status).toBe(201)
    expect(invite.token).toBeTruthy()

    const accept = await request(app)
      .get("/invites/accept")
      .set("Authorization", `Bearer ${member.accessToken}`)
      .query({ inviteId: invite.response.body.id, token: invite.token! })
    expect(accept.status).toBe(200)

    const createApiKey = await request(app)
      .post(`/orgs/${orgId}/api-keys`)
      .set("Authorization", `Bearer ${owner.accessToken}`)
      .send({ name: "Usage Key", scopes: ["events:write", "events:read"] })
    expect(createApiKey.status).toBe(201)
    const rawApiKey = createApiKey.body.apiKey as string

    const createEvent = await request(app)
      .post("/v1/events")
      .set("x-api-key", rawApiKey)
      .send({ type: "TRACK", properties: { source: "usage-test" } })
    expect(createEvent.status).toBe(201)

    const usage = await request(app)
      .get(`/orgs/${orgId}/usage`)
      .set("Authorization", `Bearer ${owner.accessToken}`)
      .query({ page: 1, limit: 20 })
    expect(usage.status).toBe(200)
    expect(usage.body.summary.eventsCount).toBeGreaterThanOrEqual(1)

    const audit = await request(app)
      .get(`/orgs/${orgId}/audit-logs`)
      .set("Authorization", `Bearer ${owner.accessToken}`)
      .query({ page: 1, limit: 100 })
    expect(audit.status).toBe(200)
    const actions = (audit.body.items as Array<{ action: string }>).map((item) => item.action)
    expect(actions).toContain("ORG_CREATED")
    expect(actions).toContain("INVITE_CREATED")
    expect(actions).toContain("MEMBER_ADDED")
    expect(actions).toContain("API_KEY_CREATED")
  })
})

