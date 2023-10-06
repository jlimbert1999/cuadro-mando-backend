import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { EarningsService } from './earnings.service';
import { CreateEarningDto } from './dto/create-earning.dto';
import { CreateProjectionDto } from './dto/create-projection.dto';
import { PaginationParams } from 'src/shared/dto/pagination-params';
import { Role } from 'src/auth/decorators/role.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-resources.interface';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('earnings')
@Auth()
export class EarningsController {
  constructor(private readonly earningsService: EarningsService) {}

  @Post()
  create(
    @GetUser('_id') id_user: string,
    @Body() createEarningDto: CreateEarningDto,
  ) {
    return this.earningsService.create(createEarningDto, id_user);
  }

  @Post('projection')
  @Role(ValidRoles.COLLECTION)
  createProjection(@Body() createProjectionDto: CreateProjectionDto) {
    return this.earningsService.createProjection(createProjectionDto);
  }

  @Post('upload')
  @Role(ValidRoles.COLLECTION)
  uploadEarning(
    @GetUser('_id') id_user: string,
    @Body() createEarningDto: CreateEarningDto[],
  ) {
    return this.earningsService.uploadEarning(createEarningDto, id_user);
  }

  @Get()
  @Role(ValidRoles.COLLECTION)
  getRecords(@Query() paginationParams: PaginationParams) {
    return this.earningsService.getRecords(paginationParams);
  }

  @Get(':date')
  getCurrentEarning(@Param('date', ParseIntPipe) date: number) {
    return this.earningsService.findCollectionByDate(new Date(date));
  }

  @Get('/comparison/projection/:date')
  getComparisonProjection(@Param('date', ParseIntPipe) date: number) {
    return this.earningsService.getCollectionPerMonth(new Date(date));
  }
}
