import { PartialType } from '@nestjs/mapped-types';
import { CreateExecutionDetailDto } from './create-execution.dto';

export class UpdateExecutionDto extends PartialType(CreateExecutionDetailDto) {}
