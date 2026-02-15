import { Request, Response } from "express";
import type { AuthService } from "../domain/auth.service.js";
import type { SignInDto } from "./validation/signin.schema.js";
import type { SignUpDto } from "./validation/signup.schema.js";

export class AuthController {
    constructor(private authService: AuthService) {}

    signIn = async (req: Request<{}, {}, SignInDto>, res: Response) => {
        const result = await this.authService.signIn(req.body)
        res.status(200).json(result)
    }

    signUp = async (req: Request<{}, {}, SignUpDto>, res: Response) => {
        const result = await this.authService.signup(req.body)
        res.status(200).json(result)
    }

}
