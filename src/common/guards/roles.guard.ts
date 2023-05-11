import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "@prisma/client";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../decorators";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (!requiredRoles) {
            return true
        }

        const request: Express.Request= context.switchToHttp().getRequest()
        console.log(request.user);

        return requiredRoles === request.user['role']
    }
}