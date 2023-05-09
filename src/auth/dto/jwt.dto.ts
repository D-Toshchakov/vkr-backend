import { UserRole } from "@prisma/client"

export type jwtDto = {
    sub: string,
    email: string,
    role: UserRole
}