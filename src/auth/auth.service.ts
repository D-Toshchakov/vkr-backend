import { ForbiddenException, Injectable } from '@nestjs/common';
import { jwtDto, signinDto, signupDto, returnUserHashObject } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2'
import { Prisma, User, UserRole } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) { }

    async register(dto: signupDto) {
        // generate the password
        const hash = await argon.hash(dto.password);
        // save user in the db
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    name: dto.name,
                    phone: dto.phone,
                    hash
                },
            })

            //sign access and refresh tokens
            const tokens = await this.signTokens(user.id, user.role)
            await this.updateRtHash(user.id, tokens.refresh_token)

            return {
                user: this.returnUserFields(user),
                ...tokens
            }

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken');
                }
            }

            throw error;
        }
    }

    async login(dto: signinDto) {

        const user = await this.validateUser(dto.email, dto.password)
        const tokens = await this.signTokens(user.id, user.role)

        await this.updateRtHash(user.id, tokens.refresh_token)

        return {
            user: this.returnUserFields(user),
            ...tokens
        }
    }

    async logout(userId: number) {
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRt: { not: null }
            },
            data: { hashedRt: null }
        })
    }

    async refreshTokens(userId: number, rt: string) {
        const user = await this.userService.findOne({ id: userId }, { hashedRt: true })
        // if user does not exist throw exception
        if (!user || !user.hashedRt) {
            throw new ForbiddenException('Access denied');
        }

        const rtSecret = this.config.get('RT_SECRET')

        // compare refresh token
        const [rtMatches, isValid] = await Promise.all([
            await argon.verify(user.hashedRt, rt),
            await this.jwt.verifyAsync(rt, { secret: rtSecret })
        ])

        // if refresh token is incorrect throw exception
        if (!rtMatches && isValid) {
            throw new ForbiddenException('Access denied');
        };

        const tokens = await this.signTokens(user.id, user.role)
        await this.updateRtHash(user.id, tokens.refresh_token)

        return {
            user: this.returnUserFields(user),
            ...tokens
        }
    }

    private async signTokens(userId: number, role: UserRole) {
        const payload: jwtDto = {
            sub: userId,
            role,
        }

        const atSecret = this.config.get('AT_SECRET')
        const rtSecret = this.config.get('RT_SECRET')

        const [access_token, refresh_token] = await Promise.all([
            this.jwt.signAsync(payload, {
                expiresIn: '1h',
                secret: atSecret,
            }),
            this.jwt.signAsync(payload, {
                expiresIn: '7d',
                secret: rtSecret,
            }),
        ])

        return { access_token, refresh_token }
    }

    async updateRtHash(userId: number, rt: string) {
        const hash = await argon.hash(rt);

        await this.prisma.user.update({
            where: { id: userId },
            data: { hashedRt: hash }
        })
    }

    private async validateUser(email: string, password: string) {
        // find the user by email
        const user = await this.userService.findOne({ email }, returnUserHashObject)

        // if user does not exist throw exception
        if (!user) {
            throw new ForbiddenException('Credentials incorrect');
        }

        if (user) {
            // compare password
            const pwMatches = await argon.verify(user.hash, password)
            // if password is incorrect throw exception
            if (!pwMatches) {
                throw new ForbiddenException('Credentials incorrect');
            };
        }
        return user
    }

    private returnUserFields(user: Partial<User>) {
        return {
            id: user.id,
            email: user.email,
            role: user.role,
        }
    }
}
