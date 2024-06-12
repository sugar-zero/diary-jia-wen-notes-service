import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { BanService } from 'src/block/block.service';

@Injectable()
export class BanStatusGuard implements CanActivate {
  constructor(private banService: BanService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userinfo = request.headers.userinfo;

    //用户豁免权，只作用于admin
    const isAdminRoute = /^\/api\/v\d+\/admin/.test(request.url);
    if (isAdminRoute) {
      const immunity = userinfo.permissions.some(
        (permissions) => permissions.value === 'user:immunity',
      );
      if (immunity) return true;
    }

    //检测用户是否被封禁
    const userBlockingStatus = await this.banService.userBlockingStatus(
      userinfo.userid,
    );
    if (userBlockingStatus) {
      throw new ForbiddenException('您的账号状态异常，请重新登录');
    }

    return true;
  }
}
