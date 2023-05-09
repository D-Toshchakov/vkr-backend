import { IsEmail, IsString } from "class-validator"

export class findUserDto {
    @IsString()
    id?: string

    @IsEmail()
    @IsString()
    email?: string

    @IsString()
    name?: string
}