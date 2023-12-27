import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Headers,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtDecrypTool } from '../utils/aes';

@Controller({
  path: 'upload',
  version: '1',
})
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly jwtDecrypTool: JwtDecrypTool,
  ) {}
  // 上传图片
  @Post('img')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file, @Headers() header) {
    this.jwtDecrypTool.getDecryp(header.authorization);
    return this.uploadService.upload(file, 'images');
  }
  // 上传头像
  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(@UploadedFile() file, @Headers() header) {
    this.jwtDecrypTool.getDecryp(header.authorization);
    return this.uploadService.upload(file, 'avatar');
  }
  // 上传日记图片
  @Post('diary-image')
  @UseInterceptors(FileInterceptor('diary'))
  uploadDiaryImg(@UploadedFile() file, @Headers() header) {
    this.jwtDecrypTool.getDecryp(header.authorization);
    return this.uploadService.upload(file, 'diary-images');
  }
}
