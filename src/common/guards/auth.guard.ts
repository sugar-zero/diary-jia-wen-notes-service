// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';
import { BanStatusGuard } from './ban-status.guard';
import { PublicRouteGuard } from './route.guard';
import { PermissionsGuard } from './permissions.guard';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtAuthGuard: JwtAuthGuard,
    private banStatusGuard: BanStatusGuard,
    private publicRouteGuard: PublicRouteGuard,
    private permissionsGuard: PermissionsGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 公共路由检查
    const isPublic = await this.publicRouteGuard.canActivate(context);
    if (isPublic) {
      return true;
    }

    // JWT 检查
    const isJwtValid = await this.jwtAuthGuard.canActivate(context);
    if (!isJwtValid) {
      return false;
    }

    // 封禁状态检查
    const isBanned = await this.banStatusGuard.canActivate(context);
    if (!isBanned) {
      return false;
    }

    // 权限检查
    return await this.permissionsGuard.canActivate(context);
  }
}
