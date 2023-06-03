import { Prisma } from "@prisma/client";
import { returnUserObject } from "src/user/dto";

export const returnReviewObject: Prisma.ReviewSelect = {
    id: true,
    rating: true,
    text: true,
    user: {
        select: returnUserObject
    },
    productId: true,
    updatedAt: true
}