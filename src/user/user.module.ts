import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SystemConfig } from '../system/entities/system.entity';
import { BlockList } from 'src/block/entities/block.entity';
import { SystemService } from '../system/system.service';
import { BanService } from 'src/block/block.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../config.prod';
import { JwtDecrypTool } from '../utils/aes';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SystemConfig, BlockList]),
    JwtModule.register(jwtConfig),
  ], //引入数据实体表跟Jwt模块
  controllers: [UserController],
  providers: [UserService, JwtDecrypTool, SystemService, BanService],
})
export class UserModule {}
