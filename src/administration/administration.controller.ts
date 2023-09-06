import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AdministrationService } from './administration.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Controller('administration')
export class AdministrationController {
  constructor(private readonly administrationService: AdministrationService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.administrationService.create(createUserDto);
  }

  @Get()
  findAll(
    @Param('limit', ParseIntPipe) limit: number,
    @Param('offset', ParseIntPipe) offset: number,
  ) {
    return this.administrationService.findAll(limit, offset);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.administrationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.administrationService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.administrationService.remove(+id);
  }
}
