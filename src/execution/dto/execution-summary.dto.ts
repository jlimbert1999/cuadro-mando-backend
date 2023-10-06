import { IsDateString, IsNumber } from 'class-validator';

export class CreateExecutionSummaryDto {
  @IsNumber()
  vigente: number;

  @IsNumber()
  ejecutado: number;

  @IsDateString()
  date: Date;
}
