import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Injectable } from '@nestjs/common';

// 响应拦截器
@Injectable()
export class ResponseIntercept implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
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
