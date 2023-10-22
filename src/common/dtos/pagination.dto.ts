import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsOptional, IsPositive, Min } from "class-validator"

export class PagintationDto {

    @ApiProperty({ default: 10, description: "Cantidad de productos a pedir" })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number

    @ApiProperty({ default: 0, description: "Cuantos productos salteo (skip)" })
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number
}