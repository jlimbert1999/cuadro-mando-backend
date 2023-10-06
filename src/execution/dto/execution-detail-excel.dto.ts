import { IsNotEmpty, IsNumber } from 'class-validator';

export class ExecutionDetailDto {
  @IsNotEmpty()
  secretaria: string;

  @IsNotEmpty()
  programa: string;

  @IsNotEmpty()
  tipoDeGasto: string;

  @IsNotEmpty()
  DA: string;

  @IsNotEmpty()
  UE: string;

  @IsNotEmpty()
  catPrg: string;

  @IsNotEmpty()
  descripcionCatPrg: string;

  @IsNotEmpty()
  @IsNumber()
  presupuestoInicial: number;

  @IsNotEmpty()
  @IsNumber()
  modAprobadas: number;

  @IsNotEmpty()
  @IsNumber()
  presupVig: number;

  @IsNotEmpty()
  @IsNumber()
  preventivo: number;

  @IsNotEmpty()
  @IsNumber()
  compromiso: number;

  @IsNotEmpty()
  @IsNumber()
  ejecutado: number;

  @IsNotEmpty()
  @IsNumber()
  pagado: number;

  @IsNotEmpty()
  @IsNumber()
  saldoDeveng: number;
}
