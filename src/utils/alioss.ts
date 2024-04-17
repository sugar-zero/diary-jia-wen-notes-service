import { Injectable } from '@nestjs/common';
import * as OSS from 'ali-oss';
import { ConfigService } from '@nestjs/config';
// import { ossConfig as prodOssConfig } from '../config.prod';
// import { ossConfig as devOssConfig } from '../config.dev2';

// 实现逻辑来自 https://blog.51cto.com/u_16105456/6260525 感谢大佬

@Injectable()
export class OssService {
  private client: any;
  private ossConfig: any = this.configService.get('oss');
  constructor(private configService: ConfigService) {
    this.client = new OSS({
      accessKeyId: this.ossConfig.accessKeyId,
      accessKeySecret: this.ossConfig.accessKeySecret,
      region: this.ossConfig.region,
      bucket: this.ossConfig.bucket,
    });
  }

  // 上传文件到oss 并返回oss地址
  public async putOssFile(ossPath: string, localPath: string): Promise<string> {
    let res: any;
    try {
      res = await this.client.put(ossPath, localPath);
      // 将文件设置为公共可读
      // await this.client.putACL(ossPath, 'public-read'); //为了安全设置有私有了
    } catch (error) {
      console.log(error);
    }
    return res ? res.name : null;
  }
  /**
   * 获取文件的url(私有)
   * @param filePath
   */
  public async getFileSignatureUrl(filePath: string): Promise<string> {
    if (filePath == null) {
      // console.log('获取文件签名失败：文件名不能为空');
      return null;
    }
    // 如果是一个url（早期是公共读，兼容一下）提取key用来签名
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      const pattern: RegExp = /([^\/]+\/\d+\.\w+)/;
      filePath = filePath.match(pattern)[0];
    }

    try {
      return this.client
        .signatureUrl(filePath, { expires: 3600 * 3 })
        .replace('http', 'https'); //如果加密后的url不是https那就替换一下
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * 上传文件大小校验
   * @param localPath
   * @param ossPath
   * @param size
   */
  public async validateFile(
    ossPath: string,
    localPath: string,
    size: number,
  ): Promise<string> {
    if (size > 5 * 1024 * 1024) {
      throw new Error('文件大小超过限制:不得大于5MB');
    } else {
      return await this.putOssFile(ossPath, localPath);
      //   return await this.putOssFile(ossPath);
    }
  }
}
