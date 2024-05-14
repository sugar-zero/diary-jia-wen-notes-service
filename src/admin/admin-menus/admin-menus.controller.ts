import { Controller, Get, Headers } from '@nestjs/common';
import { AdminMenusService } from './admin-menus.service';
import { RootMenuMeta } from './admin-menus.service';
import { JwtDecrypTool } from 'src/utils/aes';

@Controller({
  path: 'admin/menus',
  version: '1',
})
export class AdminMenusController {
  constructor(
    private readonly adminMenusService: AdminMenusService,
    private readonly jwtDecrypTool: JwtDecrypTool,
  ) {}

  @Get()
  findMenus(@Headers() header): Promise<RootMenuMeta[]> {
    return this.adminMenusService.findMenus(
      this.jwtDecrypTool.getDecryp(header.authorization),
    );
  }

  @Get('list')
  findMenuList(): Promise<RootMenuMeta[]> {
    return this.adminMenusService.findMenuList();
  }
}
