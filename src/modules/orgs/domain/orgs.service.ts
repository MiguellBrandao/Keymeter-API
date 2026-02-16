import type { OrgRepository } from "./orgs.repository.js";
import type { CreateOrg, FindOrgsByMember } from "./orgs.types.js";

export class OrgsService {
    constructor(private orgsRepository: OrgRepository) {}

    async createOrg(data: CreateOrg) {
        return await this.orgsRepository.create(data)
    }

    async findOrgsByMember(data: FindOrgsByMember) {
        return await this.orgsRepository.findByMember(data)
    }
}
