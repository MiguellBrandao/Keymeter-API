import jwt from 'jsonwebtoken'

type JwtPayload = {
    sub: string
    email: string
}

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "1h") as NonNullable<jwt.SignOptions["expiresIn"]>

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is required")
}

const JWT_SECRET_KEY: jwt.Secret = JWT_SECRET

export function generateAccessToken(payload: JwtPayload) {
   return jwt.sign(payload, JWT_SECRET_KEY, {
      expiresIn: JWT_EXPIRES_IN,
   })
}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, JWT_SECRET_KEY)
}
