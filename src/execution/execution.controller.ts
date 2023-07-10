import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { CreateExecutionDto } from './dto/create-execution.dto';

@Controller('execution')
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) { }

  @Post()
  create(@Body() createExecutionDto: CreateExecutionDto) {
    return this.executionService.create(createExecutionDto);
  }

  @Get()
  async getRecords() {
    return await this.executionService.getRecords()
  }

  @Get(':date')
  getCurrentExecution(@Param('date', ParseIntPipe) date: number) {
    return this.executionService.findExecutionByDate(new Date(date))
  }


}
