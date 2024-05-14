import { Module } from '@nestjs/common';
import { AdminPermissionsService } from './admin-permissions.service';
import { AdminPermissionsController } from './admin-permissions.controller';
import { Permissions } from './entities/admin-permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Permissions])],
  controllers: [AdminPermissionsController],
  providers: [AdminPermissionsService],
})
export class AdminPermissionsModule {}
