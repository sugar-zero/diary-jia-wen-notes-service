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
  ServiceUnavailableException,
} from '@nestjs/common';
import { decrypt } from '../utils/aes';
import { CacheService } from 'src/admin/cache/cache.service';
import { SystemService } from 'src/system/system.service';
import { ExemptionInterfaceService } from 'src/admin/exemption-interface/exemption-interface.service';

// 响应拦截器
@Injectable()
export class ResponseIntercept implements NestInterceptor {
  constructor(
    private readonly cacheService: CacheService,
    private readonly systemService: SystemService,
    private readonly exemptionInterfaceService: ExemptionInterfaceService,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const router = request.route.path;
    const inspectionGallery =
      await this.cacheService.getCache('inspectionGallery');

    // 检查系统是否在维护
    const systemInfo = await this.cacheService.getCache('system');
    try {
      if (
        !inspectionGallery.some((route: any) => router.includes(route)) &&
        systemInfo.maintenance === true
      )
        throw new ServiceUnavailableException('系统维护中，请稍后再试');
    } catch (e) {
      const systemInfo = await this.systemService.GetInfo();
      const inspectionGallery =
        await this.exemptionInterfaceService.inspectionGallery();
      if (
        !inspectionGallery.some((route: any) => router.includes(route)) &&
        systemInfo.data.maintenance === true
      )
        throw new ServiceUnavailableException('系统维护中，请稍后再试');
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
