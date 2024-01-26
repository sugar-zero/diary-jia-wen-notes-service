import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SystemModule } from 'src/system/system.module';
import { BanModule } from 'src/block/block.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtDecrypTool } from '../utils/aes';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('jwt.secret'),
          signOptions: {
            expiresIn: configService.get('jwt.signOptions.expiresIn'),
          },
        };
      },
    }),
    SystemModule,
    BanModule,
  ], //引入数据实体表跟Jwt模块
  controllers: [UserController],
  providers: [UserService, JwtDecrypTool],
})
export class UserModule {}
