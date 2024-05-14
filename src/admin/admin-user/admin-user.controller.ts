import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { AdminUserLoginDto } from './dto/admin-user-login.dto';
import { JwtDecrypTool } from 'src/utils/aes';

@Controller({
  path: 'admin/user',
  version: '1',
})
export class AdminUserController {
  constructor(
    private readonly adminUserService: AdminUserService,
    private readonly jwtDecrypTool: JwtDecrypTool,
  ) {}

  @Post('login')
  login(@Body() req: AdminUserLoginDto) {
    return this.adminUserService.login(req);
  }

  @Get('info')
  admin_user_info(@Headers() header) {
    return this.adminUserService.admin_user_info(
      this.jwtDecrypTool.getDecryp(header.authorization),
    );
  }
}
