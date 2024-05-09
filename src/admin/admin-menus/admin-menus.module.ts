import { Module } from '@nestjs/common';
import { AdminMenusService } from './admin-menus.service';
import { AdminMenusController } from './admin-menus.controller';
import { Menu } from './entities/admin-menu.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Menu])],
  controllers: [AdminMenusController],
  providers: [AdminMenusService],
})
export class AdminMenusModule {}
