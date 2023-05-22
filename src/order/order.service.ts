import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
    constructor(private prismaService: PrismaService) { }

    async getAll(userId: number) {
        this.prismaService.order.findMany({
            where: { id: userId },
            orderBy: { createdAt: 'desc' }
        })
    }

    // async createOrder(userId)
}
