import { Controller, Get, Post, Body } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { AdminUserLoginDto } from './dto/admin-user-login.dto';

@Controller({
  path: 'admin/user',
  version: '1',
})
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Post('login')
  login(@Body() req: AdminUserLoginDto) {
    return this.adminUserService.login(req);
  }

  @Get('info')
  admin_user_info() {
    return this.adminUserService.admin_user_info();
  }
}
