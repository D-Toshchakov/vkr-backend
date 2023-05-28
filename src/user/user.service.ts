import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindUserDto, UpdateUserDto, returnUserObject } from './dto/';
import { Prisma } from '@prisma/client';
import { hash } from 'argon2';
import { returnProductObject } from 'src/product/dto';

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
                UserFavorites: {
                    select: {
                        product: true
                    },
                },
                orders: {
                    select: {
                        items: true,
                        status: true,
                        createdAt: true
                    }
                }
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

    async toggleFavorite(userId: number, productId: number) {
        const user = await this.findOne({ id: userId })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        const isListed = await this.prisma.userFavorites.findFirst({
            where: { userId, productId }
        })

        if (isListed) {
            const removed = await this.prisma.userFavorites.delete({
                where: { userId_productId: { userId, productId } }
            })
        } else {
            const favorite = await this.prisma.userFavorites.create({
                data: { userId, productId }
            })
        }

        return { message: "Success" }
    }
}
