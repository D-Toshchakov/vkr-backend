import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signinDto, signupDto } from './dto';
import { GetUser, PublicRoute } from '../common/decorators';
import { RtGuard } from '../common/guards';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @PublicRoute()
    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    signUp(@Body() dto: signupDto) {
        return this.authService.register(dto);
    }

    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() dto: signinDto) {
        return this.authService.login(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('logout')
    logout(@GetUser('id') userId: number) {
        return this.authService.logout(userId);
    }

    @PublicRoute()
    @UseGuards(RtGuard)
    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    refreshToken(
        @GetUser('id') userId: number,
        @GetUser('refreshToken') rt: string,
    ) {
        return this.authService.refreshTokens(userId, rt);
    }
}
