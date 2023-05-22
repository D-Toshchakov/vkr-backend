import { Prisma } from "@prisma/client";
import { returnCategoryObject } from "src/category/dto";
import { returnReviewObject } from "src/review/dto";

export const returnProductObject: Prisma.ProductSelect = {
    id: true,
    name: true,
    images: true,
    description: true,
    price: true,
    createdAt: true,
    slug: true,
}

export const returnFullProductObject: Prisma.ProductSelect = {
    ...returnProductObject,
    reviews: { select: returnReviewObject },
    category: { select: returnCategoryObject },
}