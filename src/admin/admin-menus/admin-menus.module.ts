import { Module } from '@nestjs/common';
import { AdminMenusService } from './admin-menus.service';
import { AdminMenusController } from './admin-menus.controller';
import { Menu } from './entities/admin-menu.entity';
import { MenuMeta } from './entities/menu-meta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUserModule } from '../admin-user/admin-user.module';
import { JwtDecrypTool } from 'src/utils/aes';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, MenuMeta]), AdminUserModule],
  controllers: [AdminMenusController],
  providers: [AdminMenusService, JwtDecrypTool],
})
export class AdminMenusModule {}
