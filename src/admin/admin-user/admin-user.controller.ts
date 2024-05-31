import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Headers,
  Query,
  Delete,
} from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { AdminUserLoginDto } from './dto/admin-user-login.dto';
import { AdminRoleUpdateDto } from './dto/admin-role-update.dto';
import { AdminRoleCreateDto } from './dto/admin-role-create.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';

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
  admin_user_info(@Headers() header) {
    return this.adminUserService.admin_user_info(header.userinfo);
  }

  @Get('role/list')
  @Permissions(['role:list'])
  roleList(@Query() query) {
    return this.adminUserService.getRole(query.name);
  }

  @Put('role')
  @Permissions(['role:edit'])
  updateRole(@Body() req: AdminRoleUpdateDto) {
    return this.adminUserService.updateRole(req);
  }

  @Post('role')
  @Permissions(['role:create'])
  createRole(@Body() req: AdminRoleCreateDto) {
    return this.adminUserService.createRole(req);
  }

  @Get('role/recycle')
  @Permissions(['role:recycle'])
  getPermissionsRecycle(@Query() query) {
    return this.adminUserService.getRoleRecycle(query.name);
  }

  @Put('role/delete')
  @Permissions(['role:delete'])
  deleteRole(@Body() req) {
    return this.adminUserService.softDeleteRole(req.id);
  }

  @Delete('role/delete')
  @Permissions(['role:hard_delete'])
  softDeleteRole(@Body() req) {
    return this.adminUserService.hardDeleteRole(req.id);
  }

  @Put('role/rollback')
  @Permissions(['role:rollback'])
  rollbackPermissions(@Body() body) {
    return this.adminUserService.rollbackRole(body.id);
  }
}
