import { UserRepository } from './user.repository.js';
import { CreateUser, FindUser } from './user.types.js';

export class UsersService {
    constructor(private usersRepository: UserRepository) {}

    async createUser(data: CreateUser) {
        return this.usersRepository.createUser(data)
    }

    async findUser(params: FindUser) {
        return this.usersRepository.findUser(params)
    }
}
