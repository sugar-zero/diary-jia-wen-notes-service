import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('img')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file) {
    return { code: 200, msg: '上传成功', data: file };
  }
}
