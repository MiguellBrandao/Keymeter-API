import request from "supertest"
import { describe, expect, it } from "vitest"
import { app } from "../../app.js"
import { createOrg, createRunId, createUserAndToken } from "./helpers/scenario.js"

describe("Auth and orgs integration", () => {
  it("signs in and manages own org list", async () => {
    const runId = createRunId()
    const owner = await createUserAndToken({ runId, label: "owner" })

    const orgId = await createOrg(owner.accessToken, runId)

    const myOrgs = await request(app).get("/orgs/my").set("Authorization", `Bearer ${owner.accessToken}`)
    expect(myOrgs.status).toBe(200)
    expect(Array.isArray(myOrgs.body)).toBe(true)
    expect(myOrgs.body.some((org: { id: string }) => org.id === orgId)).toBe(true)
  })
})

