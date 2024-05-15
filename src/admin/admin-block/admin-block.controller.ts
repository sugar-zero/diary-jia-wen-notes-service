import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdminBlockService } from './admin-block.service';
import { CreateAdminBlockDto } from './dto/create-admin-block.dto';
import { UpdateAdminBlockDto } from './dto/update-admin-block.dto';

@Controller('admin-block')
export class AdminBlockController {
  constructor(private readonly adminBlockService: AdminBlockService) {}

  @Post()
  create(@Body() createAdminBlockDto: CreateAdminBlockDto) {
    return this.adminBlockService.create(createAdminBlockDto);
  }

  @Get()
  findAll() {
    return this.adminBlockService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminBlockService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdminBlockDto: UpdateAdminBlockDto,
  ) {
    return this.adminBlockService.update(+id, updateAdminBlockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminBlockService.remove(+id);
  }
}
