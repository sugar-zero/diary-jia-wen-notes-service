import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { BanService } from 'src/block/block.service';

@Injectable()
export class BanStatusGuard implements CanActivate {
  constructor(private banService: BanService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userinfo = request.headers.userinfo;

    const userBlockingStatus = await this.banService.userBlockingStatus(
      userinfo.userid,
    );
    if (userBlockingStatus) {
      throw new UnauthorizedException('您的账号状态异常，请重新登录');
    }

    return true;
  }
}
