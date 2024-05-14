import { Module } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { BanModule } from 'src/block/block.module';
import { AdminUserController } from './admin-user.controller';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtDecrypTool } from 'src/utils/aes';
import { UserRole } from './entities/admin-userRole.entity';
import { RolePermission } from '../admin-permissions/entities/admin-rolePermissions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole, RolePermission]),
    BanModule,
  ],
  controllers: [AdminUserController],
  providers: [AdminUserService, JwtDecrypTool],
  exports: [AdminUserService],
})
export class AdminUserModule {}
