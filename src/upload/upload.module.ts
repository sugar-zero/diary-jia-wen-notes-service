import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { OssService } from '../utils/alioss';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtDecrypTool } from '../utils/aes';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../images'),
        filename: (req, file, cb) => {
          cb(null, new Date().getTime() + extname(file.originalname));
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService, OssService, JwtDecrypTool],
})
export class UploadModule {}
