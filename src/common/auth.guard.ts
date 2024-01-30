import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'src/admin/cache/cache.service';
import { JwtDecrypTool } from '../utils/aes';
import { ConfigService } from '@nestjs/config';
import { BanService } from 'src/block/block.service';
import { ExemptionInterfaceService } from 'src/admin/exemption-interface/exemption-interface.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private cacheService: CacheService,
    private configService: ConfigService,
    private banService: BanService,
    private exemptionInterfaceService: ExemptionInterfaceService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const path = request.route.path;
    const method = request.method.toUpperCase();

    // 从缓存中获取不需要鉴权的路由信息
    const publicRoutes = await this.cacheService.getCache('exemptionInterface');
    // console.log(publicRoutes);
    // console.log(path);
    try {
      const isPublic = publicRoutes.some(
        (route: { routingInterface: any; method: any }) => {
          return route.routingInterface === path && route.method === method;
        },
      );
      if (isPublic) {
        return true; // 如果是公开路由，则跳过鉴权
      }
    } catch (e) {
      const publicRoutes =
        await this.exemptionInterfaceService.exemptionAuthentication();
      const isPublic = publicRoutes.some(
        (route: { routingInterface: any; method: any }) => {
          return route.routingInterface === path && route.method === method;
        },
      );
      if (isPublic) {
        return true; // 如果是公开路由，则跳过鉴权
      }
    }

    // 创建JwtDecrypTool实例，并使用JwtService对Authorization字段进行解密
    const userinfo = new JwtDecrypTool(
      new JwtService(this.configService.get('jwt')),
    ).getDecryp(request.headers.authorization);
    if (userinfo) {
      // 检查用户账号是否被禁用
      const userBlockingStatus = await this.banService.userBlockingStatus(
        userinfo.userid,
      );
      if (userBlockingStatus) {
        // 如果用户账号被禁用，则抛出未授权异常
        throw new UnauthorizedException('您的账号已被停止');
      } else {
        return request;
      }
    } else {
      throw new UnauthorizedException('登录失效,请重新登陆');
    }
  }
}
