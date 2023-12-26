import { BadRequestException, Injectable } from '@nestjs/common';
import { OssService } from '../utils/alioss';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  constructor(private readonly ossService: OssService) {}
  // 上传图片
  async upload(file: any, fileRoute: string): Promise<any> {
    const reFileName = join(__dirname, `../images/${file.filename}`);
    try {
      const ossUrl = await this.ossService.putOssFile(
        `/${fileRoute}/${file.filename}`,
        reFileName,
      );
      this.deleteLocalCacheFiles(reFileName);
      return {
        data: ossUrl.replace('http', 'https'),
        message: '上传成功',
      };
    } catch (error) {
      this.deleteLocalCacheFiles(reFileName);
      throw new BadRequestException('文件上传失败');
    }
  }
  // 删除本地缓存文件
  private async deleteLocalCacheFiles(localPath: string) {
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
  }
}
