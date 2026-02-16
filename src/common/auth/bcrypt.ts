import bcrypt from "bcryptjs";

const SALT_ROUND = 10

export async function hashValue(password: string) {
    const salt = await bcrypt.genSalt(SALT_ROUND)

    return bcrypt.hash(password, salt)
}

export async function verifyValue(value: string, hashedValue: string) {
    return await bcrypt.compare(value, hashedValue)
}
