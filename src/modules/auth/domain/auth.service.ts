import { hashPassword, verifyPassword } from '../../../common/auth/bcrypt.js';
import { generateAccessToken } from '../../../common/auth/jwt.js';
import { AppError } from '../../../common/errors/AppError.js'
import type { UsersService } from '../../users/domain/user.service.js'
import type { Signin, SignUp } from './auth.types.js';

export class AuthService {
    constructor(private userService: UsersService) {}

    async signup(body: SignUp) {
        const existing = await this.userService.findUser({ email: body.email })
        if (existing) throw new AppError({
            httpStatus: 409,
            message: 'Email already in use'
        })

        const hashedPassword = await hashPassword(body.password)

        const user = await this.userService.createUser({ email: body.email, name: body.name, password: hashedPassword })

        return { accessToken: generateAccessToken({ sub: user.id, email: user.email })}
    }

    async signIn(body: Signin) {
        const user = await this.userService.findUser({ email: body.email })
        if (!user) throw new AppError({
            httpStatus: 404,
            message: 'User not found'
        })

        const ok = await verifyPassword(body.password, user.password)
        if (!ok) {
            throw new AppError({
                httpStatus: 401,
                message: "Invalid credentials.",
            })
        }

        return { accessToken: generateAccessToken({ sub: user.id, email: user.email })}
    }
}
