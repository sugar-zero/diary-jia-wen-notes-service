import { Module } from '@nestjs/common';
import { AdminMenusService } from './admin-menus.service';
import { AdminMenusController } from './admin-menus.controller';
import { Menu } from './entities/admin-menu.entity';
import { MenuMeta } from './entities/menu-meta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminPermissionsModule } from '..//admin-permissions/admin-permissions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, MenuMeta]), AdminPermissionsModule],
  controllers: [AdminMenusController],
  providers: [AdminMenusService],
})
export class AdminMenusModule {}
