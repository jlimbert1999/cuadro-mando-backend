
import { IsNotEmpty } from 'class-validator';
export class CreateEarningDto {
    @IsNotEmpty()
    ACTIVIDADES: number;

    @IsNotEmpty()
    INMUEBLES: number;

    @IsNotEmpty()
    TASAS: number;

    @IsNotEmpty()
    VEHICULOS: number;

    @IsNotEmpty()
    date: Date
}

