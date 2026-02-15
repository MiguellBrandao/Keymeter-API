import bcrypt from "bcryptjs";

const SALT_ROUND = 10

export async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(SALT_ROUND)

    return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hashed: string) {
    return await bcrypt.compare(password, hashed)
}
