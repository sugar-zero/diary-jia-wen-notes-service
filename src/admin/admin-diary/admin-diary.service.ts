import { Injectable } from '@nestjs/common';
import { CreateAdminDiaryDto } from './dto/create-admin-diary.dto';
import { UpdateAdminDiaryDto } from './dto/update-admin-diary.dto';

@Injectable()
export class AdminDiaryService {
  create(createAdminDiaryDto: CreateAdminDiaryDto) {
    return 'This action adds a new adminDiary';
  }

  findAll() {
    return `This action returns all adminDiary`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adminDiary`;
  }

  update(id: number, updateAdminDiaryDto: UpdateAdminDiaryDto) {
    return `This action updates a #${id} adminDiary`;
  }

  remove(id: number) {
    return `This action removes a #${id} adminDiary`;
  }
}
