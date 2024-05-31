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
import { ConfigService } from '@nestjs/config';

// 响应拦截器
@Injectable()
export class ResponseIntercept implements NestInterceptor {
  constructor(
    private readonly cacheService: CacheService,
    private readonly systemService: SystemService,
    private configService: ConfigService,
    private readonly exemptionInterfaceService: ExemptionInterfaceService,
  ) {}

  /**
   * 获取系统信息。
   * 该函数首先尝试从缓存中获取系统信息。如果缓存中不存在，则通过调用系统服务获取信息，
   * 并选择性地将获取到的信息存入缓存。
   * @returns {Promise<any>} 返回一个承诺，该承诺解析为系统信息对象。
   */
  private async getSystemInfo(): Promise<any> {
    let systemInfo = await this.cacheService.getCache('system');
    // 尝试从缓存获取系统信息
    if (!systemInfo) {
      systemInfo = await this.systemService.GetInfo();
      // 读取缓存失败触发刷新缓存
      await this.cacheService.refreshCache('system');
    }
    return systemInfo;
  }

  /**
   * 异步获取检查画廊信息。
   * 此函数首先尝试从缓存中获取检查画廊信息。如果缓存中不存在所需信息，
   * 则调用接口获取最新信息，并更新缓存。
   *
   * @returns {Promise<any[]>} 返回一个承诺，该承诺解析为检查画廊信息数组。
   */
  private async getInspectionGallery(): Promise<any[]> {
    let inspectionGallery =
      await this.cacheService.getCache('inspectionGallery');
    // 尝试从缓存中获取检查画廊信息

    if (!inspectionGallery) {
      inspectionGallery =
        await this.exemptionInterfaceService.inspectionGallery();
      // 缓存未命中，从接口获取检查画廊信息并刷新缓存
      await this.cacheService.refreshCache('inspectionGallery');
    }

    return inspectionGallery;
  }

  /**
   * 检查请求是否被允许访问。
   *
   * @param request 请求对象，包含请求的详细信息，如URL。
   * @returns 返回一个Promise，解析为一个布尔值，表示请求是否被允许。
   */
  private async isAccessAllowed(request: Request): Promise<boolean> {
    // 检查请求的URL是否为管理员路由
    const isAdminRoute = /^\/api\/v\d+\/admin/.test(request.url);
    // 从缓存中获取系统信息
    const systemInfo = await this.getSystemInfo();
    // 从缓存中获取维护通道的路由信息
    const inspectionGallery = await this.getInspectionGallery();
    // 获取系统配置中的自由管理接口设置
    const { freeManagementInterface } = this.configService.get('system');

    // 如果系统不在维护模式中，允许访问
    if (systemInfo?.maintenance !== true) {
      return true;
    }

    // 如果允许通过管理接口访问，并且当前请求是管理员路由，允许访问
    if (freeManagementInterface && isAdminRoute) {
      return true;
    }

    // 如果请求的URL包含在维护画廊的路由中，允许访问
    if (
      inspectionGallery?.some((route: string) => request.url.includes(route))
    ) {
      return true;
    }

    // 如果请求未满足上述任何条件，在维护模式下不允许访问
    return false;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const router = request.route.path;

    const allowed = await this.isAccessAllowed(request);

    if (!allowed) {
      throw new ServiceUnavailableException('系统维护中，请稍后再试');
    }

    // 登录/注册只接受密文;由于不能在管道中解密，在这里解密好了
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
