import { Injectable } from '@nestjs/common';
import { CreateAdminSubscribeDto } from './dto/create-admin-subscribe.dto';
import { UpdateAdminSubscribeDto } from './dto/update-admin-subscribe.dto';

@Injectable()
export class AdminSubscribeService {
  create(createAdminSubscribeDto: CreateAdminSubscribeDto) {
    return 'This action adds a new adminSubscribe';
  }

  findAll() {
    return `This action returns all adminSubscribe`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adminSubscribe`;
  }

  update(id: number, updateAdminSubscribeDto: UpdateAdminSubscribeDto) {
    return `This action updates a #${id} adminSubscribe`;
  }

  remove(id: number) {
    return `This action removes a #${id} adminSubscribe`;
  }
}
