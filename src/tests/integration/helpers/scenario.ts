import request from "supertest"
import { vi } from "vitest"
import { app } from "../../../app.js"

export function createRunId() {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`
}

export function decodeJwtPayload(token: string): { sub: string; email?: string } {
  const payload = token.split(".")[1]
  if (!payload) throw new Error("Invalid JWT payload")
  return JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"))
}

export function extractInviteTokenFromCalls(calls: unknown[][]): string | null {
  for (let i = calls.length - 1; i >= 0; i -= 1) {
    const first = calls[i]?.[0]
    if (typeof first !== "string") continue
    if (/^[A-Za-z0-9_-]{20,}$/.test(first)) return first
  }
  return null
}

export async function createUserAndToken(params: { runId: string; label: string; password?: string }) {
  const password = params.password ?? "StrongPass123!"
  const email = `int.${params.label}.${params.runId}@example.com`
  const name = `Integration ${params.label}`

  const signup = await request(app).post("/auth/signup").send({ email, name, password })
  if (signup.status !== 201) throw new Error(`Signup failed for ${email}: ${signup.status}`)

  const signin = await request(app).post("/auth/signin").send({ email, password })
  if (signin.status !== 200) throw new Error(`Signin failed for ${email}: ${signin.status}`)

  const accessToken = signin.body.accessToken as string
  const payload = decodeJwtPayload(accessToken)

  return {
    email,
    password,
    accessToken,
    userId: payload.sub,
  }
}

export async function createOrg(ownerToken: string, runId: string) {
  const response = await request(app)
    .post("/orgs")
    .set("Authorization", `Bearer ${ownerToken}`)
    .send({ name: `Integration Org ${runId}` })

  if (response.status !== 201) throw new Error(`Create org failed: ${response.status}`)
  return response.body.id as string
}

export async function createInviteAndCaptureToken(params: {
  ownerToken: string
  orgId: string
  userId: string
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER"
}) {
  const inviteLogSpy = vi.spyOn(console, "log").mockImplementation(() => {})
  const response = await request(app)
    .post("/invites")
    .set("Authorization", `Bearer ${params.ownerToken}`)
    .send({ orgId: params.orgId, userId: params.userId, role: params.role })
  const token = extractInviteTokenFromCalls(inviteLogSpy.mock.calls)
  inviteLogSpy.mockRestore()

  return {
    response,
    token,
  }
}

