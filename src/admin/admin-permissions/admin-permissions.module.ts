import { Module } from '@nestjs/common';
import { AdminPermissionsService } from './admin-permissions.service';
import { AdminPermissionsController } from './admin-permissions.controller';
import { Permissions } from './entities/admin-permission.entity';
import { UserRole } from 'src/admin/admin-user/entities/admin-userRole.entity';
import { RolePermission } from '../admin-permissions/entities/admin-rolePermissions.entity';
import { Role } from '../admin-user/entities/admin-user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permissions, UserRole, RolePermission, Role]),
  ],
  controllers: [AdminPermissionsController],
  providers: [AdminPermissionsService],
  exports: [AdminPermissionsService],
})
export class AdminPermissionsModule {}
