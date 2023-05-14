import { IsEmail, IsString } from "class-validator"

export class findUserDto {
    id?: number

    @IsEmail()
    email?: string

    @IsString()
    name?: string
}