import { Controller, Get,  UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser, Roles } from 'src/common/decorators';
import { User } from '@prisma/client';
import { RolesGuard } from 'src/common/guards';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('me')
    getMe(@GetUser() user: User) {
        return user
    }

    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Get('protected')
    getProtected() {
        return 'protected info'
    }
}
