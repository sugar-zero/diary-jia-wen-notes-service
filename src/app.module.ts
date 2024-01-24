import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { ResponseIntercept } from './common/responseIntercept';
// import { typeOrmConfig as typeOrmConfigProduction } from './config.prod';
// import { typeOrmConfig as typeOrmConfigDevlopment } from './config.dev';
import configuration from './config/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SystemModule } from './system/system.module';
import { DiaryModule } from './diary/diary.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { SubscribeModule } from './subscribe/subscribe.module';
import { BanModule } from './block/block.module';
import { AdminUserModule } from './admin/admin-user/admin-user.module';
import { AdminDiaryModule } from './admin/admin-diary/admin-diary.module';
import { AdminBlockModule } from './admin/admin-block/admin-block.module';
import { AdminSubscribeModule } from './admin/admin-subscribe/admin-subscribe.module';

console.log(
  '当前运行环境:',
  process.env.NODE_ENV,
  process.env.MODE ? `+ ${process.env.MODE}` : '',
);
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          entities: ['dist/**/*.entity{.ts,.js}'],
          ...config.get('db.mysql'),
        } as TypeOrmModuleOptions;
      },
    }),
    UploadModule,
    UserModule,
    SystemModule,
    DiaryModule,
    CommentModule,
    LikeModule,
    SubscribeModule,
    BanModule,
    AdminUserModule,
    AdminDiaryModule,
    AdminBlockModule,
    AdminSubscribeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ResponseIntercept },
  ],
})
export class AppModule {}
