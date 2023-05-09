import { Injectable } from '@nestjs/common';
import { findUserDto } from './dto/findUserDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    findOne(user: findUserDto) {
        this.prisma.user.findFirst({
            where: {
                OR: [
                    { id: { equals: user.id } },
                    { email: { equals: user.email } },
                    { name: { equals: user.name } }
                ]
            }
        })
    }
}
