import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';

// 异常过滤器
@Catch(HttpException)
export class AbnormalFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // 获取请求上下文
    const ctx = host.switchToHttp();
    // 获取响应上下文
    const response = ctx.getResponse();
    // 获取状态码
    const status = exception.getStatus();
    // 获取异常信息
    const message = exception.message ? exception.message : 'Server Error';
    // 响应异常
    response.status(status).json({
      code: status,
      message: message,
      data: null,
      timestamp: new Date().toISOString(),
    });
  }
}
