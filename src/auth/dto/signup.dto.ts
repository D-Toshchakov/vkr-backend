import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from "class-validator"

export class signupDto {
    @IsEmail()
    email: string
    
    @MinLength(6, {
        message: 'Password must be at least 6 characters long'
    })
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    name: string 

    @IsOptional()
    @IsPhoneNumber("RU")
    phone: string
}