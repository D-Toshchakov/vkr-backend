import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser, Roles } from 'src/common/decorators';
import { RolesGuard } from 'src/common/guards';
import { UpdateUserDto, returnUserObject } from './dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('profile')
    async getProfile(@GetUser('id') id: number) {
        return this.userService.findOne({ id }, returnUserObject)
    }

    @HttpCode(HttpStatus.OK)
    @Put('profile')
    async updateProfile(
        @GetUser("id") id: number,
        @Body() dto: UpdateUserDto
    ) {
        return this.userService.updateProfile(id, dto)
    }

    @HttpCode(HttpStatus.OK)
    @Patch('profile/favorites/:productId')
    async toggleFavorite(
        @GetUser("id") id: number,
        @Param('productId') prouctId: number
    ) {
        return this.userService.toggleFavorite(id, prouctId)
    }


    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Get('protected')
    getProtected() {
        return 'protected info'
    }
}
