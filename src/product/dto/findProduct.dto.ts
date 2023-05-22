import { IsOptional, IsString } from "class-validator"

export class FindProductDto {
    @IsOptional()
    @IsString()
    id?: number;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    slug?: string;
}