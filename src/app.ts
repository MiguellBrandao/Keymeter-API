import express, { type Express } from 'express'
import { errorHandler } from './common/errors/errorHandler.js'
import { prisma } from './common/prisma/client.js'
import { buildAuthModule } from './modules/auth/index.js'
import { buildInvitesModule } from './modules/invites/index.js'
import { buildOrgsModule } from './modules/orgs/index.js'

export const app: Express = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/auth", buildAuthModule(prisma))
app.use('/orgs', buildOrgsModule(prisma))
app.use('/invites', buildInvitesModule(prisma))

app.use(errorHandler)
