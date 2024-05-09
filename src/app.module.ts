import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { ResponseIntercept } from './common/responseIntercept';
import { AuthGuard } from './common/auth.guard';
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
// import { AdminDiaryModule } from './admin/admin-diary/admin-diary.module';
// import { AdminBlockModule } from './admin/admin-block/admin-block.module';
// import { AdminSubscribeModule } from './admin/admin-subscribe/admin-subscribe.module';
import { CacheModule } from './admin/cache/cache.module';
import { ExemptionInterfaceModule } from './admin/exemption-interface/exemption-interface.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from './mail/mail.module';
import { AdminMenusModule } from './admin/admin-menus/admin-menus.module';

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
    ScheduleModule.forRoot(),
    UploadModule,
    UserModule,
    SystemModule,
    DiaryModule,
    CommentModule,
    LikeModule,
    SubscribeModule,
    BanModule,
    AdminUserModule,
    // AdminDiaryModule,
    // AdminBlockModule,
    // AdminSubscribeModule,
    CacheModule,
    ExemptionInterfaceModule,
    MailModule,
    AdminMenusModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ResponseIntercept },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
