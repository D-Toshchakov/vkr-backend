import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class updateUserDto {
    @IsEmail()
    email: string

    @IsOptional()
    @IsString()
    password?: string

    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    avatarPath: string

    

}