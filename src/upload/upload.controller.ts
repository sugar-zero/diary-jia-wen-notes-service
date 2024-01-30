import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Headers,
  Body,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtDecrypTool } from '../utils/aes';
import { TimeoutInterceptor } from 'src/common/timeout.interceptor';
import { Timeout } from 'src/common/decorators/httpTimeOut.decorator';

@Controller({
  path: 'upload',
  version: '2',
})
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly jwtDecrypTool: JwtDecrypTool,
  ) {}
  // 上传图片
  @Post('img')
  @UseInterceptors(TimeoutInterceptor)
  @Timeout(1000 * 60 * 5)
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file, @Headers() header) {
    this.jwtDecrypTool.getDecryp(header.authorization);
    return this.uploadService.upload(file, 'images');
  }
  // 上传头像
  @Post('avatar')
  @UseInterceptors(TimeoutInterceptor)
  @Timeout(1000 * 60 * 5)
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(@UploadedFile() file, @Headers() header) {
    this.jwtDecrypTool.getDecryp(header.authorization);
    return this.uploadService.upload(file, 'avatar');
  }
  // 上传日记图片
  @Post('diary-image')
  @UseInterceptors(TimeoutInterceptor)
  @Timeout(1000 * 60 * 5)
  @UseInterceptors(FileInterceptor('diary'))
  uploadDiaryImg(@UploadedFile() file, @Headers() header) {
    this.jwtDecrypTool.getDecryp(header.authorization);
    return this.uploadService.upload(file, 'diary-images');
  }

  // 上传日记图片(修改日记用)
  @Post('diary-image-patch')
  @UseInterceptors(TimeoutInterceptor)
  @Timeout(1000 * 60 * 5)
  @UseInterceptors(FileInterceptor('diary'))
  patchDiaryImg(@UploadedFile() file, @Headers() header, @Body() req) {
    return this.uploadService.patchImg(
      file,
      'diary-images',
      req,
      this.jwtDecrypTool.getDecryp(header.authorization),
    );
  }
}
