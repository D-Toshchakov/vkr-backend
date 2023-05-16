import { Prisma } from "@prisma/client";

export const returnUserObject: Prisma.UserSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
    avatarPath: true,
    phone: true,
}