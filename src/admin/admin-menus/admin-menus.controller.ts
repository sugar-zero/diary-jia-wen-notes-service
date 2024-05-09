import { Controller, Get } from '@nestjs/common';
import { AdminMenusService } from './admin-menus.service';

@Controller({
  path: 'admin/menus',
  version: '1',
})
export class AdminMenusController {
  constructor(private readonly adminMenusService: AdminMenusService) {}

  @Get()
  findMenus() {
    return this.adminMenusService.findMenus();
  }
}
