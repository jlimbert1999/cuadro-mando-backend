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

  @Get('departments/:date')
  getExecutionByDepartments(@Param('date') date: string) {
    return this.executionService.findExecutionByDepartments(new Date(date))
  }
  @Get('departments/:department/:date')
  getDetailsOneDepartment(@Param('department') department: string, @Param('date') date: string) {
    return this.executionService.getDetailsOneDepartment(new Date(date), department)
  }


}
