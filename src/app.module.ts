import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { typeOrmConfig } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';
import { SystemModule } from './system/system.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), UploadModule, UserModule, SystemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
