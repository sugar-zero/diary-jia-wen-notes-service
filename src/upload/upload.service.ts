import { BadRequestException, Injectable } from '@nestjs/common';
import { OssService } from '../utils/alioss';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  constructor(private readonly ossService: OssService) {}
  // 上传照片
  async upload(file: any, fileRoute: string): Promise<any> {
    const reFileName = join(__dirname, `../images/${file.filename}`);
    try {
      const ossUrl = await this.ossService.putOssFile(
        `/${fileRoute}/${file.filename}`,
        reFileName,
      );
      // 删除本地文件
      fs.unlink(reFileName, (error) => console.log(error));
      return {
        data: ossUrl.replace('http', 'https'),
        message: '上传成功',
      };
    } catch (error) {
      // 删除本地文件
      fs.unlink(reFileName, (error) => console.log(error));
      throw new BadRequestException('文件上传失败');
    }
  }
}
