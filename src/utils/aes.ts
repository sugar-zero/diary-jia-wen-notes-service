import { BadRequestException, Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import { JwtService } from '@nestjs/jwt';

const KEY = CryptoJS.enc.Utf8.parse('42812104913');
const IV = CryptoJS.enc.Utf8.parse('31940121824');

export const encrypt = (text: string) => {
  const encrypted = CryptoJS.AES.encrypt(text, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CTR,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};
export const decrypt = (text: string) => {
  const decrypt = CryptoJS.AES.decrypt(text, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CTR,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
};

@Injectable()
export class JwtDecrypTool {
  constructor(private readonly jwtService: JwtService) {}
  getDecryp(token: string) {
    let decodeToken: any;
    try {
      decodeToken = this.jwtService.verify(token.split('Bearer ')[1]);
    } catch (e) {
      throw new BadRequestException('登录失效,请重新登陆');
    }
    if (!decodeToken) throw new BadRequestException('登录失效,请重新登陆');
    if (decodeToken.exp - decodeToken.iat <= 0)
      throw new BadRequestException('登录超时,请重新登陆');
    return decodeToken;
  }
}
