import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { EarningsService } from './earnings.service';
import { CreateEarningDto } from './dto/create-earning.dto';
import { CreateProjectionDto } from './dto/create-projection.dto';

@Controller('earnings')
export class EarningsController {
  constructor(private readonly earningsService: EarningsService) { }

  @Post()
  create(@Body() createEarningDto: CreateEarningDto) {
    return this.earningsService.create(createEarningDto);
  }

  @Post('projection')
  createProjection(@Body() createProjectionDto: CreateProjectionDto) {
    return this.earningsService.createProjection(createProjectionDto);
  }
  @Post('upload')
  uploadEarning(@Body() createEarningDto: CreateEarningDto[]) {
    return this.earningsService.uploadEarning(createEarningDto);
  }

  @Get()
  getRecords() {
    return this.earningsService.getRecords()
  }

  @Get(':date')
  getCurrentEarning(@Param('date', ParseIntPipe) date: number) {
    return this.earningsService.findEarningByDate(new Date(date))
  }

  @Get('/comparison/:date')
  getComparisonData(
    @Param('date', ParseIntPipe) date: number
  ) {
    return this.earningsService.getComparisonData(new Date(date))
  }


}
