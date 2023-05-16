import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { ReviewDto, returnReviewObject } from './dto';

@Injectable()
export class ReviewService {
    constructor(private prisma: PrismaService) { }

    async createReview(dto: ReviewDto, userId: number) {
        const product = await this.prisma.product.findUnique({ where: { id: dto.productId } })
        if (!product) {
            throw new NotFoundException('Product not found')
        }

        return this.prisma.review.create({
            data: {
                rating: dto.rating,
                text: dto.text,
                product: {
                    connect: { id: dto.productId }
                },
                user: {
                    connect: { id: userId }
                }
            }
        })
    }

    async getAverageRatingByProductId(productId: number) {
        const avgRating = await this.prisma.review.aggregate({
            where: { productId },
            _avg: { rating: true }
        }).then((data) => data._avg)
        
        if (!avgRating.rating) {
            throw new NotFoundException('Product not found')
        }

        return avgRating
    }

    async findOne(id: number) {
        const review = await this.prisma.review.findUnique({
            where: {
                id,
            },
            select: returnReviewObject
        })

        if (!review) {
            throw new NotFoundException('Review not found')
        }

        return review
    }

    async updateReview(id: number, dto: ReviewDto) {
        const review = await this.prisma.review.findUnique({
            where: {
                id,
            },
        })

        if (review) {
            throw new BadRequestException('Review already exist')
        }

        return this.prisma.review.update({
            where: { id },
            data: {
                text: dto.text,
                rating: dto.rating
            }
        })
    }

}

