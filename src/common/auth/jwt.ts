import e from 'express'
import jwt from 'jsonwebtoken'

type JwtPayload = {
    sub: string
    email: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export function generateAccessToken(payload: JwtPayload) {
   return jwt.sign(payload, JWT_SECRET)
}

export function verifiyAccessToken(token: string) {
    return jwt.verify(token, JWT_SECRET)
}
