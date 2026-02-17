import "express"

declare global {
  namespace Express {
    interface User {
      sub: string
      email?: string
    }

    interface Request {
      user?: User
      apiKey?: {
        id: string
        orgId: string
        scopes: string[]
        keyPrefix: string
        name: string
      }
      validatedQuery?: Record<string, unknown>
      validatedParams?: Record<string, unknown>
    }
  }
}

export {}
