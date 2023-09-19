import { IsDateString, IsNumber } from 'class-validator';

export class CreateExecutionDto {
  @IsNumber()
  vigente: number;

  @IsNumber()
  ejecutado: number;

  @IsDateString()
  date: Date;
}
