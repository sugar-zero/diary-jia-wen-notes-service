// timeout.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { TIMEOUT_KEY } from './decorators/httpTimeOut.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const customTimeout =
      this.reflector.get<number>(TIMEOUT_KEY, context.getHandler()) || 5000;

    return next.handle().pipe(
      timeout(customTimeout),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          throw new RequestTimeoutException(`等待响应超时`);
        }
        throw err;
      }),
    );
  }
}
