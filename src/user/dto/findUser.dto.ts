import { IsEmail, IsString } from "class-validator"

export class FindUserDto {
    id?: number

    @IsEmail()
    email?: string
}