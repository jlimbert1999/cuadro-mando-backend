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
import { PaginationParams } from 'src/shared/dto/pagination-params';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Role } from 'src/auth/decorators/role.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-resources.interface';
import { User } from 'src/administration/schemas/user.schema';
import {
  CreateExecutionDetailDto,
  CreateExecutionSummaryDto,
  ExcelExecutionSummary,
} from './dto';

@Controller('execution')
@Auth()
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  @Post('upload/detail')
  @Role(ValidRoles.EXECUTION)
  createDetail(
    @Body() createExecutionDto: CreateExecutionDetailDto,
    @GetUser() user: User,
  ) {
    return this.executionService.uploadDetail(createExecutionDto, user);
  }

  @Post('upload/summary')
  @Role(ValidRoles.EXECUTION)
  uploadSummary(
    @Body() excelExecutionSummary: ExcelExecutionSummary,
    @GetUser() user: User,
  ) {
    return this.executionService.uploadSummary(excelExecutionSummary, user._id);
  }

  @Post()
  @Role(ValidRoles.EXECUTION)
  createSummaryExecution(
    @GetUser('_id') id_user: string,
    @Body() createExecutionSummaryDto: CreateExecutionSummaryDto,
  ) {
    return this.executionService.createSummaryExecution(
      createExecutionSummaryDto,
      id_user,
    );
  }

  @Get('detail/:date')
  getCurrentDetailExecution(@Param('date', ParseIntPipe) date: number) {
    return this.executionService.findDetailExecutionByDate(new Date(date));
  }

  @Get(':date')
  getCurrentExecution(@Param('date', ParseIntPipe) date: number) {
    return this.executionService.findExecutionByDate(new Date(date));
  }

  @Get('departments/:department/:date')
  async getDetailsOneDepartment(
    @Param('department') department: string,
    @Param('date') date: string,
  ) {
    return await this.executionService.getDetailsByDepartment(
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
