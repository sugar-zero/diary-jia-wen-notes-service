import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { decrypt, JwtDecrypTool } from '../utils/aes';
import { jwtConfig } from '../config.prod';
import { JwtService } from '@nestjs/jwt';

// 响应拦截器
@Injectable()
export class ResponseIntercept implements NestInterceptor {
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
        new JwtDecrypTool(new JwtService(jwtConfig)).getDecryp(
          request.headers.authorization,
        );
      }
    }
    if (request.body.secret) {
      request.body = JSON.parse(decrypt(request.body.secret));
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
