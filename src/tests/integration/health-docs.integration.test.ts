import request from "supertest"
import { describe, expect, it } from "vitest"
import { app } from "../../app.js"

describe("Health and docs integration", () => {
  it("returns health status and swagger docs", async () => {
    const health = await request(app).get("/health")
    expect([200, 503]).toContain(health.status)
    expect(health.body).toHaveProperty("checks.db")
    expect(health.body).toHaveProperty("checks.redis")

    const docsJson = await request(app).get("/docs.json")
    expect(docsJson.status).toBe(200)
    expect(docsJson.body.openapi).toBe("3.0.3")

    const docsUi = await request(app).get("/docs/")
    expect(docsUi.status).toBe(200)
  })
})

