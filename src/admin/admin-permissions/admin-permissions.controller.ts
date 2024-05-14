import { Controller, Get } from '@nestjs/common';
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
}
