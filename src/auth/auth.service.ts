import { Injectable } from '@nestjs/common';
import { createUserDto } from './dto/createUserDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    createUser(user: createUserDto) {
        return this.prisma.user.create({ data: user });
    }
}
