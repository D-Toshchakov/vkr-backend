import { UserRole } from "@prisma/client"

export type jwtDto = {
    sub: number,
    role: UserRole
}