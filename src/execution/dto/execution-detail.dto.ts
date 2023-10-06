import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { ExecutionDetailDto } from './execution-detail-excel.dto';

export class CreateExecutionDetailDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ExecutionDetailDto)
  data: ExecutionDetailDto[];

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  date: Date;
}
