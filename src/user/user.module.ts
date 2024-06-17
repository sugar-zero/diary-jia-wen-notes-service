import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ResetToekn } from './entities/resetToken.entity';
import { SystemModule } from 'src/system/system.module';
import { BanModule } from 'src/block/block.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtDecrypTool } from '../utils/aes';
import { ConfigService } from '@nestjs/config';
import { MailModule } from 'src/mail/mail.module';
import { OssService } from 'src/utils/alioss';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ResetToekn]),
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
    MailModule,
  ], //引入数据实体表跟Jwt模块
  controllers: [UserController],
  providers: [UserService, JwtDecrypTool, OssService],
})
export class UserModule {}
