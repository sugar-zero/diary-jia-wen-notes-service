import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permissions } from './entities/admin-permission.entity';

@Injectable()
export class AdminPermissionsService {
  constructor(
    @InjectRepository(Permissions)
    private readonly PermissionsRepository: Repository<Permissions>,
  ) {}

  async getPermissionsList(): Promise<Permissions[]> {
    return await this.PermissionsRepository.find();
  }
}
