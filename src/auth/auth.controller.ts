import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signupDto } from './dto/signup.dto';
import { signinDto } from './dto';
import { Tokens } from './types';
import { GetUser, GetUserId, PublicRoute } from '../common/decorators';
import { RtGuard, AtGuard } from '../common/guards';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @PublicRoute()
    @HttpCode(HttpStatus.CREATED)
    @Post('signup')
    signUp(@Body() dto: signupDto): Promise<Tokens> {
        return this.authService.signup(dto);
    }

    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signIn(@Body() dto: signinDto): Promise<Tokens> {
        return this.authService.signin(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('logout')
    logout(@GetUserId() userId: string) {
        return this.authService.logout(userId);
    }

    @PublicRoute()
    @UseGuards(RtGuard)
    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    refreshToken(
        @GetUserId() userId: string,
        @GetUser('refreshToken') refreshToken: string
    ) {
        
        return this.authService.refreshTokens(userId, refreshToken);
    }
}
