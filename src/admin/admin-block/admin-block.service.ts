import { Injectable } from '@nestjs/common';
import { CreateAdminBlockDto } from './dto/create-admin-block.dto';
import { UpdateAdminBlockDto } from './dto/update-admin-block.dto';

@Injectable()
export class AdminBlockService {
  create(createAdminBlockDto: CreateAdminBlockDto) {
    return 'This action adds a new adminBlock';
  }

  findAll() {
    return `This action returns all adminBlock`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adminBlock`;
  }

  update(id: number, updateAdminBlockDto: UpdateAdminBlockDto) {
    return `This action updates a #${id} adminBlock`;
  }

  remove(id: number) {
    return `This action removes a #${id} adminBlock`;
  }
}
