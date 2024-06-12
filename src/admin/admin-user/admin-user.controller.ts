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

  @Get('list')
  @Permissions(['user:list'])
  userList(@Query() query) {
    return this.adminUserService.userList(query.name);
  }

  @Get('role/list')
  @Permissions(['role:list'])
  roleList(@Query() query) {
    return this.adminUserService.getRole(query.name);
  }

  @Put('role')
  @Permissions(['role:edit'])
  updateRole(@Body() req: AdminRoleUpdateDto, @Headers() header) {
    return this.adminUserService.updateRole(req, header);
  }

  @Post('role')
  @Permissions(['role:create'])
  createRole(@Body() req: AdminRoleCreateDto, @Headers() header) {
    return this.adminUserService.createRole(req, header);
  }

  @Get('role/recycle')
  @Permissions(['role:recycle'])
  getPermissionsRecycle(@Query() query) {
    return this.adminUserService.getRoleRecycle(query.name);
  }

  @Put('role/delete')
  @Permissions(['role:delete'])
  softDeleteRole(@Body() req) {
    return this.adminUserService.softDeleteRole(req.id);
  }

  @Delete('role/delete')
  @Permissions(['role:hard_delete'])
  hardDeleteRole(@Body() req) {
    return this.adminUserService.hardDeleteRole(req.id);
  }

  @Put('role/rollback')
  @Permissions(['role:rollback'])
  rollbackPermissions(@Body() body) {
    return this.adminUserService.rollbackRole(body.id);
  }
  @Get('role')
  @Permissions(['user:edit'])
  fetchRoles(@Headers() header) {
    return this.adminUserService.fetchRoles(header.userinfo);
  }

  @Post('block')
  @Permissions(['user:block'])
  blockUser(@Body() body) {
    return this.adminUserService.blockUser(body);
  }

  @Put('unblock')
  @Permissions(['user:unblock'])
  unblockUser(@Body() body) {
    return this.adminUserService.unblockUser(body.userid);
  }

  @Post('create')
  @Permissions(['user:create'])
  createUser(@Body() body) {
    return this.adminUserService.createUser(body);
  }

  @Put('update')
  @Permissions(['user:edit'])
  updateUser(@Body() body, @Headers() header) {
    return this.adminUserService.updateUser(body, header.userinfo);
  }
}
