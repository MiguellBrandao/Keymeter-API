export type CreateUser = {
    email: string
    name: string
    password: string
}

export type FindUser = {
    id?: string
    email?: string
}
