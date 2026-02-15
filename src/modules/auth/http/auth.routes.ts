import { Router } from "express";
import { validateBody } from "../../../common/http/validateBody.js";
import type { AuthController } from "./auth.controller.js";
import { SignInSchema } from "./validation/signin.schema.js";
import { SignUpSchema } from "./validation/signup.schema.js";

export const AuthRoutes = (authController: AuthController) => {
    const router = Router()

    router.post('/signin', validateBody(SignInSchema), authController.signIn)
    router.post('/signup', validateBody(SignUpSchema), authController.signUp)

    return router
}
