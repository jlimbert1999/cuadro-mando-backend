import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
export class CreateProjectionDto {
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(12)
    @ArrayMaxSize(12)
    @Type(() => Projection)
    months: Projection[];

    @IsNotEmpty()
    year: number
}

class Projection {
    @IsNotEmpty()
    ACTIVIDADES: number;

    @IsNotEmpty()
    INMUEBLES: number;

    @IsNotEmpty()
    TASAS: number;

    @IsNotEmpty()
    VEHICULOS: number;
}
