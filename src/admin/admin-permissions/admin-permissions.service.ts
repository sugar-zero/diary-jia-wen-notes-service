import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Permissions } from './entities/admin-permission.entity';

@Injectable()
export class AdminPermissionsService {
  constructor(
    @InjectRepository(Permissions)
    private readonly PermissionsRepository: Repository<Permissions>,
  ) {}

  async getPermissionsList(): Promise<Permissions[]> {
    return await this.PermissionsRepository.find({
      where: { DeletedAt: IsNull() },
    });
  }

  async getPermissionsByName(name: string) {
    return await this.PermissionsRepository.createQueryBuilder('permissions')
      .where('permissions.DeletedAt IS NULL')
      .andWhere(
        '(permissions.name LIKE :name OR permissions.label LIKE :name)',
        {
          name: `%${name}%`,
        },
      )
      .getMany();
  }

  async getPermissionsRecycle(name: string) {
    if (!name) {
      return await this.PermissionsRepository.createQueryBuilder('permissions')
        .where('permissions.DeletedAt IS NOT NULL')
        .getMany();
    } else {
      return await this.PermissionsRepository.createQueryBuilder('permissions')
        .where('permissions.DeletedAt IS NOT NULL')
        .andWhere(
          '(permissions.name LIKE :name OR permissions.label LIKE :name)',
          {
            name: `%${name}%`,
          },
        )
        .getMany();
    }
  }

  // 创建权限
  async createPermission(data: any) {
    const { name, label } = data;
    if (name && label) {
      const permission = await this.PermissionsRepository.findOne({
        where: { name: name },
      });
      if (permission) {
        throw new BadRequestException('权限已存在');
      }
      await this.PermissionsRepository.save({
        name,
        label,
      });
      return {
        message: '权限创建完成',
      };
    }
  }

  // 更新权限
  async update(data: any) {
    await this.PermissionsRepository.update(data.id, {
      name: data.name,
      label: data.label,
      UpdatedAt: new Date().toLocaleString(),
    });
  }
}
