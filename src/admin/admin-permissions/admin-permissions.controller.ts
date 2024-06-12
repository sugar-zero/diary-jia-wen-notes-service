import {
  Controller,
  Get,
  Put,
  Query,
  Body,
  Post,
  Headers,
} from '@nestjs/common';
import { AdminPermissionsService } from './admin-permissions.service';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller({
  path: 'admin/permissions',
  version: '1',
})
export class AdminPermissionsController {
  constructor(
    private readonly adminPermissionsService: AdminPermissionsService,
  ) {}
  @Get('list')
  getPermissionsList(@Headers() header: any) {
    const path = /\/system\/role/;
    if (path.test(header.referer)) {
      return this.adminPermissionsService.getPermissionsList_Role(
        header.userinfo,
      );
    } else {
      return this.adminPermissionsService.getPermissionsList();
    }
  }

  @Get('query')
  getPermissionsByName(@Query() query) {
    if (!query.name) return this.adminPermissionsService.getPermissionsList();
    return this.adminPermissionsService.getPermissionsByName(query.name);
  }

  @Get('recycle')
  @Permissions(['auth:recycle'])
  getPermissionsRecycle(@Query() query) {
    return this.adminPermissionsService.getPermissionsRecycle(query.name);
  }

  @Put('update')
  @Permissions(['auth:edit'])
  updatePermissions(@Body() body, @Headers() header) {
    return this.adminPermissionsService.update(body, header.userinfo);
  }

  @Post('create')
  @Permissions(['auth:create'])
  createPermissions(@Body() body) {
    return this.adminPermissionsService.createPermission(body);
  }

  @Get('rolePermission')
  @Permissions(['role:edit'])
  getRolePermission(@Query() query) {
    return this.adminPermissionsService.GetRoleAuth({ roleId: query.roleId });
  }

  @Put('rollback')
  @Permissions(['auth:rollback'])
  rollbackPermissions(@Body() body) {
    return this.adminPermissionsService.rollbackPermission(body.id);
  }

  @Put('delete')
  @Permissions(['auth:delete'])
  softDeletePermissions(@Body() body) {
    return this.adminPermissionsService.softDeletePermission(body.id);
  }
}
