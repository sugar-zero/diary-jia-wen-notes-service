import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({
  path: 'upload',
  version: '1',
})
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  // 上传图片
  @Post('img')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file) {
    return this.uploadService.upload(file, 'images');
  }
  // 上传头像
  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(@UploadedFile() file) {
    return this.uploadService.upload(file, 'avatar');
  }
}
