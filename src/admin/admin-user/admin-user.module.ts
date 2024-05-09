import { Module } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { BanModule } from 'src/block/block.module';
import { AdminUserController } from './admin-user.controller';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User]), BanModule],
  controllers: [AdminUserController],
  providers: [AdminUserService],
})
export class AdminUserModule {}
