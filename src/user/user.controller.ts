import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/createUserDto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

}
