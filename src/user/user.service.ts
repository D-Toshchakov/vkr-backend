import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindUserDto, UpdateUserDto, returnUserObject } from './dto/';
import { Prisma } from '@prisma/client';
import { hash } from 'argon2';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async findOne(dto: FindUserDto, selectObject: Prisma.UserSelect = {}) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { id: { equals: dto.id } },
                    { email: { equals: dto.email } },
                ]
            },
            select: {
                ...returnUserObject,
                ...selectObject,
                favorites: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        images: true,
                        slug: true
                    },
                },
            }
        })
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user
    }

    async updateProfile(id: number, dto: UpdateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email }
        })

        if (user && id !== user.id) {
            // user with email from dto already exists
            // but it is not the same user
            throw new BadRequestException('Email is taken')
        }

        return this.prisma.user.update({
            where: { id },
            data: {
                email: dto.email,
                name: dto.name,
                avatarPath: dto.avatarPath,
                phone: dto.phone,
                hash: dto.password ? await hash(dto.password) : user.hash
            }
        })

    }

    async toggleFavorite(id: number, productId: number) {
        const user = await this.findOne({ id })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        const isListed = user.favorites.some(product => product.id === productId)

        await this.prisma.user.update({
            where: { id },
            data: {
                favorites: {
                    [isListed ? "disconnect" : "connect"]: { id: productId }
                }
            }
        })

        return { message: "Success" }
    }
}
