import {
  Controller,
  Get,
  Put,
  Query,
  Body,
  Post,
  Delete,
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
      return this.adminPermissionsService.getPermissionsList(header.userinfo);
    }
  }

  @Get('query')
  getPermissionsByName(@Query() query, @Headers() header) {
    if (!query.name)
      return this.adminPermissionsService.getPermissionsList(header.userinfo);
    return this.adminPermissionsService.getPermissionsByName(
      query.name,
      header.userinfo,
    );
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
  rollbackPermissions(@Body() body, @Headers() header) {
    return this.adminPermissionsService.rollbackPermission(body.id, header);
  }

  @Put('delete')
  @Permissions(['auth:delete'])
  softDeletePermissions(@Body() body, @Headers() header) {
    return this.adminPermissionsService.softDeletePermission(body.id, header);
  }
}
