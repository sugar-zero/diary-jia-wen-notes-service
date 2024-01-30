import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminSubscribeService } from './admin-subscribe.service';
import { CreateAdminSubscribeDto } from './dto/create-admin-subscribe.dto';
import { UpdateAdminSubscribeDto } from './dto/update-admin-subscribe.dto';

@Controller('admin-subscribe')
export class AdminSubscribeController {
  constructor(private readonly adminSubscribeService: AdminSubscribeService) {}

  @Post()
  create(@Body() createAdminSubscribeDto: CreateAdminSubscribeDto) {
    return this.adminSubscribeService.create(createAdminSubscribeDto);
  }

  @Get()
  findAll() {
    return this.adminSubscribeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminSubscribeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminSubscribeDto: UpdateAdminSubscribeDto) {
    return this.adminSubscribeService.update(+id, updateAdminSubscribeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminSubscribeService.remove(+id);
  }
}
