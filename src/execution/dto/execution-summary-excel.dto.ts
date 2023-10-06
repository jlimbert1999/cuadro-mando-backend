import { Type } from 'class-transformer';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { CreateExecutionSummaryDto } from './execution-summary.dto';

export class ExcelExecutionSummary {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateExecutionSummaryDto)
  data: CreateExecutionSummaryDto[];
}
