import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { CacheService } from 'src/admin/cache/cache.service';
import { ExemptionInterfaceService } from 'src/admin/exemption-interface/exemption-interface.service';

@Injectable()
export class PublicRouteGuard implements CanActivate {
  constructor(
    private cacheService: CacheService,
    private exemptionInterfaceService: ExemptionInterfaceService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const path = request.route.path;
    const method = request.method.toUpperCase();

    // 从缓存中获取不需要鉴权的路由信息
    let publicRoutes = await this.cacheService.getCache('exemptionInterface');
    if (!publicRoutes) {
      publicRoutes =
        await this.exemptionInterfaceService.exemptionAuthentication();
      await this.cacheService.refreshCache('exemptionInterface');
    }

    const isPublic = publicRoutes.some(
      (route: { routingInterface: any; method: any }) => {
        return route.routingInterface === path && route.method === method;
      },
    );

    return isPublic;
  }
}
