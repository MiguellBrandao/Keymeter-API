import { Router } from "express"
import { requireAuth } from "../../../common/http/requireAuth.js"
import { validateBody } from "../../../common/http/validateBody.js"
import { validateQuery } from "../../../common/http/validateQuery.js"
import type { InvitesController } from "./invites.controller.js"
import { AcceptInviteSchema } from "./validation/accept-invite.schema.js"
import { InviteUserSchema } from "./validation/invite-user.schema.js"
import { RevokeInviteSchema } from "./validation/revoke-invite.schema.js"

export const InvitesRoutes = (invitesController: InvitesController) => {
    const router = Router()

    router.use(requireAuth)

    router.post("/", validateBody(InviteUserSchema), invitesController.inviteUser)
    router.get("/accept", validateQuery(AcceptInviteSchema), invitesController.acceptInvite)
    router.post("/revoke", validateBody(RevokeInviteSchema), invitesController.revokeInvite)

    return router
}
