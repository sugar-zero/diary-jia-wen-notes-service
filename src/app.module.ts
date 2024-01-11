import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { typeOrmConfig as typeOrmConfigProduction } from './config.prod';
import { typeOrmConfig as typeOrmConfigDevlopment } from './config.dev';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';
import { SystemModule } from './system/system.module';
import { DiaryModule } from './diary/diary.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';

console.log(
  '当前运行环境:',
  process.env.NODE_ENV,
  process.env.MODE ? `+ ${process.env.MODE}` : '',
);
@Module({
  imports: [
    TypeOrmModule.forRoot(
      process.env.NODE_ENV === 'prod'
        ? typeOrmConfigProduction
        : typeOrmConfigDevlopment,
    ),
    UploadModule,
    UserModule,
    SystemModule,
    DiaryModule,
    CommentModule,
    LikeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
