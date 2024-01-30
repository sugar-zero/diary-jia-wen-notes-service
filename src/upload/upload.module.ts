import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { OssService } from '../utils/alioss';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtDecrypTool } from '../utils/aes';
import { DiaryModule } from '../diary/diary.module';
import { Diary } from 'src/diary/entities/diary.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Diary]),
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../images'),
        filename: (req, file, cb) => {
          cb(null, new Date().getTime() + extname(file.originalname));
        },
      }),
    }),
    DiaryModule,
  ],
  controllers: [UploadController],
  providers: [UploadService, OssService, JwtDecrypTool],
})
export class UploadModule {}
