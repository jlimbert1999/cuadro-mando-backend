import { Type } from 'class-transformer';
import { IsInt, IsPositive, Min } from 'class-validator';

export class PaginationParams {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset: number;
}
