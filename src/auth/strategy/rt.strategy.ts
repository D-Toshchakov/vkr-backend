import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtDto } from "../dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Request } from "express";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        config: ConfigService,
        private prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('RT_SECRET'),
            passReqToCallback: true
        })
    }

    async validate(req: Request, payload: jwtDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            },
        })

        delete user.hash
        delete user.hashedRt

        const refreshToken = req.get('Authorization').replace('Bearer', '').trim()
        return { ...user, refreshToken };
    }
}