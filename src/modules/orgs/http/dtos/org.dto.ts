import type { Org } from "../../../../common/prisma/generated/client.js"

export const OrgDto = {
  from(org: Org) {
    return {
      id: org.id,
      name: org.name,
    }
  },
}
