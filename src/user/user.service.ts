import { Injectable } from '@nestjs/common';
import { findUserDto } from './dto/findUser.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async findOne(dto: findUserDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { id: { equals: dto.id } },
                    { email: { equals: dto.email } },
                    // { name: { equals: dto.name } }
                ]
            }
        })
        return user
    }
}
