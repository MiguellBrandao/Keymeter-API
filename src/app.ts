import express, { type Express } from 'express'
import { errorHandler } from './common/errors/errorHandler.js'
import { prisma } from './common/prisma/client.js'
import { redis } from './common/redis/client.js'
import { buildAuthModule } from './modules/auth/index.js'
import { buildInvitesModule } from './modules/invites/index.js'
import { buildOrgsModule } from './modules/orgs/index.js'
import { buildEventsModule } from './modules/events/index.js'

export const app: Express = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/health', async (_req, res) => {
  const startedAt = Date.now()

  const [dbResult, redisResult] = await Promise.allSettled([
    prisma.$queryRawUnsafe('SELECT 1'),
    redis.ping(),
  ])

  const checks = {
    db: dbResult.status === 'fulfilled' ? 'up' : 'down',
    redis: redisResult.status === 'fulfilled' ? 'up' : 'down',
  } as const

  const healthy = checks.db === 'up' && checks.redis === 'up'

  const response = {
    status: healthy ? 'ok' : 'degraded',
    checks,
    durationMs: Date.now() - startedAt,
    timestamp: new Date().toISOString(),
  }

  return res.status(healthy ? 200 : 503).json(response)
})

app.use("/auth", buildAuthModule(prisma))
app.use('/orgs', buildOrgsModule(prisma))
app.use('/invites', buildInvitesModule(prisma))
app.use('/v1/events', buildEventsModule(prisma))

app.use(errorHandler)
