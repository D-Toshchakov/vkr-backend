import { Prisma } from "@prisma/client";
import { returnFullProductObject, returnProductObject } from "src/product/dto";
import { returnUserObject } from "src/user/dto";

export const returnOrderObject: Prisma.OrderSelect = {
    id: true,
    createdAt: true,
    status: true,
    items: {
        select: {
            id: true,
            product: { select: returnFullProductObject },
            quantity: true,
            price: true
        }
    },
    total: true,
    user: {
        select: returnUserObject
    },
}