import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtDto } from "../dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        config: ConfigService,
        private prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('AT_SECRET')
        })
    }

    async validate(payload: jwtDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            },
        })

        delete user.hash
        delete user.hashedRt

        return user;
    }
}