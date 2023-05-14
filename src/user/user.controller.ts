import { Controller, Get,  HttpCode,  HttpStatus,  Put,  UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {  GetUser, Roles } from 'src/common/decorators';
import { RolesGuard } from 'src/common/guards';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('profile')
    getProfile(@GetUser('id') id: number) {
        
        // return this.userService.getUserById(id)
    }

    @HttpCode(HttpStatus.OK)
    @Put('profile')
    updateProfile() {

    }


    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Get('protected')
    getProtected() {
        return 'protected info'
    }
}
