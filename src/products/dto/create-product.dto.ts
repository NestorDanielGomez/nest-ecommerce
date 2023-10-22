import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator"

export class CreateProductDto {
    @ApiProperty({ type: "string", description: "Product Title", nullable: false, minLength: 1 })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({ type: "number", description: "Product price" })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({ type: "string", description: "Product description" })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: "kids_racing_stripe_tee", description: "Product Slug", uniqueItems: true })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({ example: 5, description: "Product Stock", default: 0 })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({ example: ["M", "L", "XL"], description: "Product Sizes" })
    @IsString({ each: true })
    @IsArray()
    sizes: string[]

    @ApiProperty({ example: "woman", description: "Product Gender" })
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @ApiProperty({ example: "{ shirt }", description: "Product Tags" })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags?: string[]

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[]
}
