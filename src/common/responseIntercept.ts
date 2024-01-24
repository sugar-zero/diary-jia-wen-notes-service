import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { decrypt, JwtDecrypTool } from '../utils/aes';
// import { jwtConfig } from '../config.prod';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// 响应拦截器
@Injectable()
export class ResponseIntercept implements NestInterceptor {
  constructor(private configService: ConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const router = request.route.path;
    const freerouting = ['/system/config', 'login', 'reg'];
    //如果是免鉴权路由
    if (freerouting.some((route) => router.includes(route))) {
      //什么都不做
    } else {
      if (!request.headers.authorization) {
        throw new UnauthorizedException('登录失效,请重新登陆');
      } else {
        new JwtDecrypTool(
          new JwtService(this.configService.get('jwt')),
        ).getDecryp(request.headers.authorization);
      }
    }
    // 登录/注册只接受密文
    if (['/login', '/reg'].some((route) => router.includes(route))) {
      if (!request.body.secret) {
        throw new BadRequestException('非法请求');
      } else {
        request.body = JSON.parse(decrypt(request.body.secret));
      }
    }
    // 处理请求
    return next.handle().pipe(
      map((data) => {
        return {
          code: 200,
          data: data,
          message: 'success',
        };
      }),
    );
  }
}
