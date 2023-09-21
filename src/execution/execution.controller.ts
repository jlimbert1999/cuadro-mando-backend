import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { CreateExecutionDetailDto } from './dto/create-execution.dto';
import { CreateExecutionDto } from './dto/execution.dto';
import { PaginationParams } from 'src/shared/dto/pagination-params';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Role } from 'src/auth/decorators/role.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-resources.interface';

@Controller('execution')
@Auth()
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  @Post('detail')
  @Role(ValidRoles.EXECUTION)
  createDetail(@Body() createExecutionDto: CreateExecutionDetailDto) {
    return this.executionService.createDetail(createExecutionDto);
  }

  @Post()
  @Role(ValidRoles.EXECUTION)
  create(
    @GetUser('_id') id_user: string,
    @Body() createExecutionDto: CreateExecutionDto,
  ) {
    return this.executionService.create(createExecutionDto, id_user);
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

  @Get('records')
  @Role(ValidRoles.EXECUTION)
  async getRecords(@Query() paginationParams: PaginationParams) {
    return await this.executionService.getDetailedRecords(paginationParams);
  }
  @Get('records/summary')
  @Role(ValidRoles.EXECUTION)
  async getRecordSummary(@Query() params: PaginationParams) {
    return await this.executionService.getRecordsSummary(params);
  }
}
