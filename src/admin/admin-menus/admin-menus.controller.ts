import { Controller, Get, Headers, Put, Body } from '@nestjs/common';
import { AdminMenusService } from './admin-menus.service';
import { RootMenuMeta } from './admin-menus.service';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller({
  path: 'admin/menus',
  version: '1',
})
export class AdminMenusController {
  constructor(private readonly adminMenusService: AdminMenusService) {}

  @Get()
  findMenus(@Headers() header): Promise<RootMenuMeta[]> {
    return this.adminMenusService.findMenus(header.userinfo);
  }

  @Get('list')
  @Permissions(['menus:list'])
  findMenuList(): Promise<RootMenuMeta[]> {
    return this.adminMenusService.findMenuList();
  }

  @Put()
  @Permissions(['menus:edit'])
  updateMenu(@Body() menu) {
    return this.adminMenusService.updateMenu(menu);
  }
}
