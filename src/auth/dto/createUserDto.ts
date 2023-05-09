import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class createUserDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    name: string

    // createdAt: Date
    // updatedAt: Date
    // avatarPath String 

    // role UserRole 
}