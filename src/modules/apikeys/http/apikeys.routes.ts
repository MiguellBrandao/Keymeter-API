import { Router } from "express";
import type { ApiKeysController } from "./apikeys.controller.js";
import { OrgIdParamSchema } from "./validation/org-id-param.schema.js";
import { validateParams } from "../../../common/http/validateParams.js";
import { validateBody } from "../../../common/http/validateBody.js";
import { validateQuery } from "../../../common/http/validateQuery.js";
import { requireAuth } from "../../../common/http/requireAuth.js";
import { CreateApiKeySchema } from "./validation/create-apikey.schema.js";
import { FindApiKeysQuerySchema } from "./validation/find-apikeys-query.schema.js";
import { RevokeKeySchema } from "./validation/revoke-key.schema.js";
import { RotateKeySchema } from "./validation/rotate-key.schema.js";

export const ApiKeysRoutes = (apiKeysController: ApiKeysController) => {
    const router = Router()

    router.use(requireAuth)

    router.post('/:orgId/api-keys', validateParams(OrgIdParamSchema), validateBody(CreateApiKeySchema), apiKeysController.generateApiKey)
    router.get('/:orgId/api-keys', validateParams(OrgIdParamSchema), validateQuery(FindApiKeysQuerySchema), apiKeysController.findApiKeysByOrg)
    router.patch('/:orgId/api-keys/rotate', validateParams(OrgIdParamSchema), validateBody(RotateKeySchema), apiKeysController.rotateApiKey)
    router.patch('/:orgId/api-keys/revoke', validateParams(OrgIdParamSchema), validateBody(RevokeKeySchema), apiKeysController.revokeApiKey)

    return router
}


