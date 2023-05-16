import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "@prisma/client";
import { KeysOfUnion } from "../types";

export const GetUser = createParamDecorator(
    (data: KeysOfUnion<User | { refreshToken: string }> , ctx: ExecutionContext) => {
        const request: Express.Request = ctx.switchToHttp().getRequest();
        const user = request.user
        return data ? user[data] : user
    }
)