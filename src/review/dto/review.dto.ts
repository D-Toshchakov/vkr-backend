import { IsNotEmpty, IsString } from "class-validator";
import { IsNumber, Max, Min } from "class-validator";

export class ReviewDto {
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @IsString()
    text: string;
    
    @IsNotEmpty()
    @IsNumber()
    productId: number
}