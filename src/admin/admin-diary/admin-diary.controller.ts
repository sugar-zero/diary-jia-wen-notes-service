import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdminDiaryService } from './admin-diary.service';
import { CreateAdminDiaryDto } from './dto/create-admin-diary.dto';
import { UpdateAdminDiaryDto } from './dto/update-admin-diary.dto';

@Controller('admin-diary')
export class AdminDiaryController {
  constructor(private readonly adminDiaryService: AdminDiaryService) {}

  @Post()
  create(@Body() createAdminDiaryDto: CreateAdminDiaryDto) {
    return this.adminDiaryService.create(createAdminDiaryDto);
  }

  @Get()
  findAll() {
    return this.adminDiaryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminDiaryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdminDiaryDto: UpdateAdminDiaryDto,
  ) {
    return this.adminDiaryService.update(+id, updateAdminDiaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminDiaryService.remove(+id);
  }
}
