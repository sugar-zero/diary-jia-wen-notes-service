import { Injectable } from '@nestjs/common';
import * as OSS from 'ali-oss';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';
// import { ossConfig as prodOssConfig } from '../config.prod';
// import { ossConfig as devOssConfig } from '../config.dev2';

// 实现逻辑来自 https://blog.51cto.com/u_16105456/6260525 感谢大佬

@Injectable()
export class OssService {
  private client: any;
  private ossConfig: any = this.configService.get('oss');
  private cdnConfig: any = this.configService.get('cdn');
  constructor(private configService: ConfigService) {
    this.client = new OSS({
      accessKeyId: this.ossConfig.accessKeyId,
      accessKeySecret: this.ossConfig.accessKeySecret,
      region: this.ossConfig.region,
      bucket: this.ossConfig.bucket,
      secure: this.ossConfig.secure,
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
      if (this.cdnConfig.useCdn === true) {
        const cresourceName = `/${filePath}`;
        const cdnUrl = this.cdnConfig.cdnUrl;
        let cdnSignedPath = `${cdnUrl}${cresourceName}`;
        const timestamp = Math.floor(new Date().getTime() / 1000);
        const rand = Math.floor(Math.random() * 1000000);
        const uid = 0;
        const secret = this.cdnConfig.secret;

        const sstring =
          cresourceName +
          '-' +
          timestamp +
          '-' +
          rand +
          '-' +
          uid +
          '-' +
          secret;

        const md5hash = CryptoJS.MD5(sstring).toString();
        return (cdnSignedPath += `?auth_key=${timestamp}-${rand}-${uid}-${md5hash}`);
      } else {
        if (this.ossConfig.cname === true) {
          const originalSignedUrl = this.client.signatureUrl(filePath, {
            expires: 3600 * 3,
          });
          const defaultDomain = this.ossConfig.ossUrl;
          const cnameUrl = this.ossConfig.cnameUrl;

          return originalSignedUrl.replace(defaultDomain, cnameUrl);
        } else {
          return this.client.signatureUrl(filePath, {
            expires: 3600 * 3,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * 上传文件大小校验
   * @param localPath 本地路径
   * @param ossPath oss路径
   * @param fileSize 文件大小
   * @param limitSize 限制大小：M
   */
  public async validateFile(
    ossPath: string,
    localPath: string,
    fileSize: number,
    limitSize: number,
  ): Promise<string> {
    if (fileSize > limitSize * 1024 * 1024) {
      throw new Error(`文件大小超过限制:不得大于${limitSize}MB`);
    } else {
      return await this.putOssFile(ossPath, localPath);
      //   return await this.putOssFile(ossPath);
    }
  }
}
