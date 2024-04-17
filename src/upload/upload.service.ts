import { BadRequestException, Injectable } from '@nestjs/common';
import { OssService } from '../utils/alioss';
import { join } from 'path';
import * as fs from 'fs';
// import { InjectRepository } from '@nestjs/typeorm';
import { DiaryService } from 'src/diary/diary.service';
// import { Repository } from 'typeorm';
// import { Diary } from 'src/diary/entities/diary.entity';

@Injectable()
export class UploadService {
  constructor(
    // @InjectRepository(Diary)
    // private readonly diaryRepository: Repository<Diary>,
    private readonly ossService: OssService,
    private readonly diaryService: DiaryService,
  ) {}
  // 上传图片
  async upload(file: any, fileRoute: string): Promise<any> {
    const reNameFile = join(__dirname, `../images/${file.filename}`);
    try {
      const ossUrl = await this.ossService.putOssFile(
        `/${fileRoute}/${file.filename}`,
        reNameFile,
      );
      this.deleteLocalCacheFiles(reNameFile);
      return {
        data: ossUrl,
        message: '上传成功',
      };
    } catch (error) {
      this.deleteLocalCacheFiles(reNameFile);
      throw new BadRequestException('文件上传失败');
    }
  }
  // 更新图片
  async patchImg(
    file: any,
    fileRoute: string,
    { diaryId },
    { userid },
  ): Promise<any> {
    const reNameFile = join(__dirname, `../images/${file.filename}`);
    // 更新日记图片前先鉴权
    const diaryOwner = await this.diaryService.findDiaryOwner(diaryId);
    if (diaryOwner.user_id !== userid) {
      this.deleteLocalCacheFiles(reNameFile);
      throw new BadRequestException('这篇日记不属于你,你不能更换图片');
    }

    try {
      const ossUrl = await this.ossService.putOssFile(
        `/${fileRoute}/${file.filename}`,
        reNameFile,
      );
      this.deleteLocalCacheFiles(reNameFile);
      return {
        data: ossUrl,
        message: '上传成功',
      };
    } catch (error) {
      this.deleteLocalCacheFiles(reNameFile);
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
