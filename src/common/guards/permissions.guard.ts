// permissions.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminPermissionsService } from 'src/admin/admin-permissions/admin-permissions.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private adminPermissionsService: AdminPermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userinfo = request.headers.userinfo;

    const permissionsMetadata = this.reflector.getAllAndOverride<{
      auths: string[];
      resultMode?: boolean;
      superMode?: boolean;
      authAny?: boolean;
    }>(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!permissionsMetadata) {
      return true; // 如果没有权限要求，直接通过
    }

    const { auths, resultMode, superMode, authAny } = permissionsMetadata;

    await this.adminPermissionsService.filter(
      userinfo.userid,
      auths,
      resultMode,
      superMode,
      authAny,
    );

    return true;
  }
}
