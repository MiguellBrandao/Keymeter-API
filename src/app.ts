import express, { type Express } from 'express'
import { errorHandler } from './common/errors/errorHandler.js'
import { prisma } from './common/prisma/client.js'
import { buildAuthModule } from './modules/auth/index.js'

export const app: Express = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/auth", buildAuthModule(prisma))
app.use(errorHandler)
