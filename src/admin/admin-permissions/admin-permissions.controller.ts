import { Controller, Get, Put, Query, Body, Post } from '@nestjs/common';
import { AdminPermissionsService } from './admin-permissions.service';

@Controller({
  path: 'admin/permissions',
  version: '1',
})
export class AdminPermissionsController {
  constructor(
    private readonly adminPermissionsService: AdminPermissionsService,
  ) {}
  @Get('list')
  getPermissionsList() {
    return this.adminPermissionsService.getPermissionsList();
  }

  @Get('query')
  getPermissionsByName(@Query() query) {
    if (!query.name) return this.adminPermissionsService.getPermissionsList();
    return this.adminPermissionsService.getPermissionsByName(query.name);
  }

  @Get('recycle')
  getPermissionsRecycle(@Query() query) {
    return this.adminPermissionsService.getPermissionsRecycle(query.name);
  }

  @Put('update')
  recyclePermissions(@Body() body) {
    return this.adminPermissionsService.update(body);
  }

  @Post('create')
  createPermissions(@Body() body) {
    return this.adminPermissionsService.createPermission(body);
  }
}
