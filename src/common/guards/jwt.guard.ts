import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtDecrypTool } from '../../utils/aes';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('登录失效,请重新登陆');
    }

    const userinfo = new JwtDecrypTool(
      new JwtService(this.configService.get('jwt')),
    ).getDecryp(token);

    if (!userinfo) {
      throw new UnauthorizedException('登录失效,请重新登陆');
    }

    request.headers.userinfo = userinfo;
    return true;
  }
}
