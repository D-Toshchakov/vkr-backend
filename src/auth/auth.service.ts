import { ForbiddenException, Injectable } from '@nestjs/common';
import { jwtDto, signinDto, signupDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2'
import { Prisma, User, UserRole } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Tokens } from './types';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) { }

    async signup(dto: signupDto): Promise<Tokens> {
        // generate the password
        const hash = await argon.hash(dto.password);
        // save user in the db
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    name: dto.name,
                    hash
                },
            })

            // CONSIDER NOT SENDING TOKENS WHEN JUST CREATED USER
            //sign access and refresh tokens
            const tokens = await this.signTokens(user.id, user.email, user.role)
            await this.updateRtHash(user.id, tokens.refresh_token)

            return tokens
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken');
                }
            }

            throw error;
        }
    }

    async signin(dto: signinDto) {
        // find the user by email
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        })
        // if user does not exist throw exception
        if (!user) {
            throw new ForbiddenException('Credentials incorrect');
        }

        // compare password
        const pwMatches = await argon.verify(user.hash, dto.password)
        // if password is incorrect throw exception
        if (!pwMatches) {
            throw new ForbiddenException('Credentials incorrect');
        };

        const tokens = await this.signTokens(user.id, user.email, user.role)
        await this.updateRtHash(user.id, tokens.refresh_token)
        
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            ...tokens,
        }
    }

    async logout(userId: string) {
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRt: { not: null }
            },
            data: { hashedRt: null }
        })
    }

    async refreshTokens(userId: string, rt: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        })
        // if user does not exist throw exception
        if (!user || !user.hashedRt) {
            throw new ForbiddenException('Access denied');
        }

        // compare password
        const rtMatches = await argon.verify(user.hashedRt, rt)
        // if password is incorrect throw exception
        if (!rtMatches) {
            throw new ForbiddenException('Access denied');
        };

        const tokens = await this.signTokens(user.id, user.email, user.role)
        await this.updateRtHash(user.id, tokens.refresh_token)
        return tokens
    }

    async signTokens(userId: string, email: string, role: UserRole) {
        const payload: jwtDto = {
            sub: userId,
            role,
            email,
        }

        const atSecret = this.config.get('AT_SECRET')
        const rtSecret = this.config.get('RT_SECRET')

        const [access_token, refresh_token] = await Promise.all([
            this.jwt.signAsync(payload, {
                expiresIn: '15m',
                secret: atSecret,
            }),
            this.jwt.signAsync(payload, {
                expiresIn: '7d',
                secret: rtSecret,
            }),
        ])

        return { access_token, refresh_token }
    }

    async updateRtHash(userId: string, rt: string) {
        const hash = await argon.hash(rt);

        await this.prisma.user.update({
            where: { id: userId },
            data: { hashedRt: hash }
        })
    }
}
