import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { CreateExecutionDetailDto } from './dto/create-execution.dto';
import { CreateExecutionDto } from './dto/execution.dto';

@Controller('execution')
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  @Post('detail')
  createDetail(@Body() createExecutionDto: CreateExecutionDetailDto) {
    return this.executionService.createDetail(createExecutionDto);
  }

  @Post()
  create(@Body() createExecutionDto: CreateExecutionDto) {
    return this.executionService.create(createExecutionDto);
  }

  @Get()
  async getRecords() {
    return await this.executionService.getRecords();
  }

  @Get('detail/:date')
  getCurrentDetailExecution(@Param('date', ParseIntPipe) date: number) {
    return this.executionService.findDetailExecutionByDate(new Date(date));
  }
  @Get(':date')
  getCurrentExecution(@Param('date', ParseIntPipe) date: number) {
    return this.executionService.findExecutionByDate(new Date(date));
  }

  @Get('departments/:date')
  getExecutionByDepartments(@Param('date') date: string) {
    return this.executionService.findExecutionByDepartments(new Date(date));
  }

  @Get('departments/:department/:date')
  getDetailsOneDepartment(
    @Param('department') department: string,
    @Param('date') date: string,
  ) {
    return this.executionService.getDetailsOneDepartment(
      new Date(date),
      department,
    );
  }
}
