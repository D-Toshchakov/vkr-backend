import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnumProductSort, FindProductDto, GetAllProductsDto, ProductDto, returnFullProductObject, returnProductObject } from './dto';
import { slugify } from 'src/utils/slugify';
import { PaginationService } from 'src/pagination/pagination.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
    constructor(
        private prisma: PrismaService,
        private pagination: PaginationService
    ) { }

    async getAll(dto: GetAllProductsDto = {}) {
        const { sort, searchTerm } = dto
        const prismaSort: Prisma.ProductOrderByWithRelationInput[] = []

        if (sort === EnumProductSort.LOW_PRICE) {
            prismaSort.push({ price: 'asc' })
        } else if (sort === EnumProductSort.HIGH_PRICE) {
            prismaSort.push({ price: 'desc' })
        } else if (sort === EnumProductSort.OLDEST) {
            prismaSort.push({ createdAt: 'asc' })
        } else {
            prismaSort.push({ createdAt: 'desc' })
        }

        const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm ? {
            OR: [
                {
                    category: {
                        name: {
                            contains: searchTerm,
                            mode: 'insensitive'
                        }
                    }
                },
                {
                    name: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                },
                {
                    description: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                }
            ]
        } : {}

        const { perPage, skip } = this.pagination.getPagination(dto)

        const products = await this.prisma.product.findMany({
            where: prismaSearchTermFilter,
            orderBy: prismaSort,
            skip,
            take: perPage,
            select: returnFullProductObject
        })

        return {
            products,
            length: await this.prisma.product.count({ where: prismaSearchTermFilter })
        }
    }

    async createProduct() {
        const product = await this.prisma.product.create({
            data: {
                name: '',
                description: '',
                price: 0,
                slug: '',
                categoryId: 1,
            }
        })
        return product.id
    }

    async findOne(dto: FindProductDto) {
        const product = await this.prisma.product.findFirst({
            where: {
                OR: [
                    { id: { equals: dto.id } },
                    { name: { equals: dto.name } },
                    { slug: { equals: dto.slug } }
                ]
            },
            select: returnFullProductObject
        })

        if (!product) {
            throw new NotFoundException('Product not found')
        }

        return product
    }

    async findByCategory(categorySlug: string) {
        const products = await this.prisma.product.findMany({
            where: {
                category: {
                    slug: { equals: categorySlug }
                }
            },
            select: returnFullProductObject
        })

        if (products.length == 0) {
            throw new NotFoundException('Products not found')
        }

        return products
    }

    async getSimilar(id: number) {
        const currentProduct = await this.findOne({ id })

        if (!currentProduct) {
            throw new NotFoundException('Product not found')
        }

        const products = await this.prisma.product.findMany({
            where: {
                category: { name: currentProduct.category.name },
                NOT: { id },
            },
            orderBy: { createdAt: 'desc' },
            select: returnProductObject,
        })

        return products
    }


    async updateProduct(id: number, dto: ProductDto) {
        const { name, description, price, images, categoryId } = dto
        return this.prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price,
                images,
                slug: slugify(dto.name),
                category: {
                    connect: { id: categoryId }
                }
            }
        })
    }
}
