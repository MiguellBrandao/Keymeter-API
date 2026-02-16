import jwt from 'jsonwebtoken'

type JwtPayload = {
    sub: string
    email: string
}

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h"

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is required")
}

export function generateAccessToken(payload: JwtPayload) {
   return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
   })
}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, JWT_SECRET)
}
