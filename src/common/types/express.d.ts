import "express"

declare global {
  namespace Express {
    interface User {
      sub: string
      email?: string
    }

    interface Request {
      user?: User
      validatedQuery?: Record<string, unknown>
      validatedParams?: Record<string, unknown>
    }
  }
}

export {}
