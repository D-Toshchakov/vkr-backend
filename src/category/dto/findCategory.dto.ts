import { IsOptional, IsString } from "class-validator"

export class FindCategoryDto {
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