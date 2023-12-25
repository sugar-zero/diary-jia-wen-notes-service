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

console.log(process.env.NODE_ENV);
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
