import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindCategoryDto, returnCategoryObject, CategoryDto } from './dto';
import { slugify } from 'src/utils/slugify';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) { }


    async createCategory() {
        return this.prisma.category.create({
            data: { name: '', slug: '' }
        })
    }

    async getAll() {
        return this.prisma.category.findMany({
            select: returnCategoryObject
        })
    }

    async findOne(dto: FindCategoryDto) {
        const category = await this.prisma.category.findFirst({
            where: {
                OR: [
                    { id: { equals: dto.id } },
                    { name: { equals: dto.name } },
                    { slug: { equals: dto.slug } }
                ]
            },
            select: returnCategoryObject
        })

        if (!category) {
            throw new NotFoundException('Category not found')
        }

        return category
    }

    async updateCategory(id: number, dto: CategoryDto) {
        const category = await this.prisma.category.findUnique({
            where: { id },
        })

        if (!category) {
            throw new NotFoundException('Category not found')
        }

        return this.prisma.category.update({
            where: { id },
            data: {
                name: dto.name,
                slug: slugify(dto.name)
            }
        })
    }
}

