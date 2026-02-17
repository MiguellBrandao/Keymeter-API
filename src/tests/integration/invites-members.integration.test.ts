import request from "supertest"
import { describe, expect, it } from "vitest"
import { app } from "../../app.js"
import { createInviteAndCaptureToken, createOrg, createRunId, createUserAndToken } from "./helpers/scenario.js"

describe("Invites and members integration", () => {
  it("invites, accepts, changes role and removes member", async () => {
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

    const changeRole = await request(app)
      .patch(`/orgs/${orgId}/member`)
      .set("Authorization", `Bearer ${owner.accessToken}`)
      .send({ userId: member.userId, role: "ADMIN" })
    expect(changeRole.status).toBe(200)
    expect(changeRole.body.role).toBe("ADMIN")

    const deleteMember = await request(app)
      .delete(`/orgs/${orgId}/member/${member.userId}`)
      .set("Authorization", `Bearer ${owner.accessToken}`)
    expect(deleteMember.status).toBe(200)
    expect(deleteMember.body.success).toBe(true)
  })
})

