import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { Permissions } from './entities/admin-permission.entity';
import { UserRole } from '../admin-user/entities/admin-userRole.entity';
import { RolePermission } from '../admin-permissions/entities/admin-rolePermissions.entity';
import { Role } from '../admin-user/entities/admin-user.entity';

@Injectable()
export class AdminPermissionsService {
  constructor(
    @InjectRepository(Permissions)
    private readonly PermissionsRepository: Repository<Permissions>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(RolePermission)
    private readonly rolePermission: Repository<RolePermission>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * @returns 获取权限列表（权限管理用）
   */
  async getPermissionsList({ userid }): Promise<any> {
    await this.filter(userid, ['auth:list']);
    return await this.PermissionsRepository.find();
  }

  /**
   * @returns 获取权限列表（角色管理用）
   */
  async getPermissionsList_Role(userInfo): Promise<any> {
    await this.filter(userInfo.userid, ['role:list']);
    const permissions = await this.PermissionsRepository.find();
    const filteredPermissions = permissions.filter((permission) => {
      const limiter = Array.isArray(permission.limiter)
        ? permission.limiter
        : [];
      if (limiter.length === 0 || limiter === null) {
        return true;
      }

      return userInfo.permissions.some((userPermission) =>
        limiter.includes(userPermission.value),
      );
    });

    return filteredPermissions;
  }

  //检索权限值
  async getPermissionsByName(name: string, { userid }) {
    await this.filter(userid, ['auth:list']);
    return await this.PermissionsRepository.createQueryBuilder('permissions')
      .where('(permissions.name LIKE :name OR permissions.label LIKE :name)', {
        name: `%${name}%`,
      })
      .getMany();
  }

  //查找被删除的权限
  async getPermissionsRecycle(name: string) {
    if (!name) {
      return await this.PermissionsRepository.createQueryBuilder('permissions')
        .where('permissions.DeletedAt IS NOT NULL')
        .withDeleted()
        .getMany();
    } else {
      return await this.PermissionsRepository.createQueryBuilder('permissions')
        .where('permissions.DeletedAt IS NOT NULL')
        .andWhere(
          '(permissions.name LIKE :name OR permissions.label LIKE :name)',
          {
            name: `%${name}%`,
          },
        )
        .withDeleted()
        .getMany();
    }
  }
  /**
   * 恢复权限
   */
  async rollbackPermission(id: number, { userid }) {
    await this.filter(userid, ['auth:rollback']);
    const permission = await this.PermissionsRepository.findOne({
      where: {
        id,
      },
      withDeleted: true,
    });
    if (!permission) {
      throw new BadRequestException('权限不存在');
    }
    permission.DeletedAt = null;
    const rollbackResult = await this.PermissionsRepository.save(permission);
    if (rollbackResult) {
      return {
        message: '恢复权限成功',
      };
    }
  }

  /**
   * 软删除权限
   */
  async softDeletePermission(id: number, { userid }) {
    await this.filter(userid, ['auth:delete']);

    const permission = await this.PermissionsRepository.findOne({
      where: {
        id,
        DeletedAt: IsNull(),
      },
    });
    if (!permission) {
      throw new BadRequestException('权限不存在');
    }
    //权限是否有分配到某个角色
    const rolePermission = await this.rolePermission.find({
      where: {
        permissionId: id,
      },
    });
    const assignedRoles = rolePermission.map((item) => item.roleId);
    const Role = await this.roleRepository.find({
      where: {
        id: In(assignedRoles),
      },
    });
    if (Role.length) {
      const assignedRolesLabel = Role.map((item) => item.label);
      if (rolePermission) {
        throw new BadRequestException(
          `该权限已分配到角色：【${assignedRolesLabel}】，请先取消授权`,
        );
      }
    }
    const deleteResult = await this.PermissionsRepository.softDelete(id);
    if (deleteResult.affected) {
      return {
        message: '权限删除成功',
      };
    } else {
      throw new BadRequestException('权限删除失败');
    }
  }

  // 创建权限
  async createPermission(data: any) {
    const { name, label } = data;

    if (name && label) {
      const permission = await this.PermissionsRepository.findOne({
        where: { name: name },
      });
      if (permission) {
        throw new BadRequestException('权限已存在');
      }
      await this.PermissionsRepository.save({
        name,
        label,
      });
      return {
        message: '权限创建完成',
      };
    }
  }

  // 更新权限
  async update(data: any, { userid }) {
    const filterResult_limiter = await this.filter(
      userid,
      ['auth:limiter'],
      true,
    );

    let updateInfo = {};
    switch (filterResult_limiter) {
      case true:
        updateInfo = {
          name: data.name,
          label: data.label,
          limiter: data.limiter,
          UpdatedAt: new Date().toLocaleString(),
        };
        break;
      default:
        updateInfo = {
          name: data.name,
          label: data.label,
          UpdatedAt: new Date().toLocaleString(),
        };
        break;
    }

    await this.PermissionsRepository.update(data.id, updateInfo);
  }

  /**
   * 过滤权限
   * 用于检查是否有某个或全部权限，super与admin无需单独添加（验证所有权限时无效）
   * @param userid 用户id
   * @param auths 需要校验的权限列表
   * @param resultMode 结果模式，true：只返回true或false；false(默认)：权限不满足直接报错
   * @param superMode 超管模式，默认false：额外添加验证super,admin权限；true：额外添加验证super权限；（验证所有权限时无效）
   * @param authAny 是否只需满足任意权限，默认true
   */
  async filter(
    userid: number,
    auths: string[],
    resultMode: boolean = false,
    superMode: boolean = false,
    authAny: boolean = true,
  ) {
    const userRoles = await this.userRoleRepository.find({
      where: { userId: userid },
      select: ['roleId'],
    });
    if (!userRoles) {
      return false;
    }
    const userRolesId = userRoles.map((ur) => ur.roleId);
    const rolePermission = await this.rolePermission.find({
      where: { roleId: In(userRolesId) },
      relations: ['permission'],
    });

    // 合并并返回用户的所有权限
    const userPermissions = rolePermission.map((rp) => {
      return rp.permission.name;
    });

    /**
     * 过滤用户是否有某一项或全部权限
     */
    if (authAny) {
      // 为auths添加预制权限
      if (superMode) {
        // auths.push('super');
      } else {
        // auths.push('super', 'admin');
      }
      //过滤一下去掉重复的项
      auths = [...new Set(auths)];
      //匹配任意权限，只要满足一个即可
      const result = auths.some((auth) => userPermissions.includes(auth));
      // console.log('Result (authAny):', result);

      if (!result && !resultMode) {
        throw new BadRequestException('您没有权限操作');
      } else {
        return result;
      }
    } else {
      //匹配所有权限，必须全部满足
      const result = auths.every((auth) => userPermissions.includes(auth));
      // console.log('Result (authEvery):', result);
      if (!result && !resultMode) {
        throw new BadRequestException('您没有权限操作');
      }
    }
  }

  /**
   * 仅获取用户权限组
   * @param userid 用户id
   * @returns 用户权限组
   */
  async GetUserAuth(userid: number) {
    const userRoles = await this.userRoleRepository.find({
      where: { userId: userid },
      select: ['roleId'],
    });
    if (!userRoles) {
      return [];
    }
    const userRolesId = userRoles.map((ur) => ur.roleId);
    const rolePermission = await this.rolePermission.find({
      where: { roleId: In(userRolesId) },
      relations: ['permission'],
    });

    // 合并并返回用户的所有权限
    return rolePermission.map((rp) => {
      return rp.permission.name;
    });
  }

  //获取角色权限
  async GetRoleAuth({ roleId }: { roleId: number }) {
    if (!roleId) {
      throw new BadRequestException('角色id不能为空');
    }
    const result = await this.rolePermission.find({
      where: { roleId },
      relations: ['permission'],
    });
    return result.map((item) => {
      return {
        id: item.permission.id,
        label: item.permission.label,
      };
    });
  }

  //更新角色权限
  async UpdateRoleAuth(roleId: number, permissionIds: number[]) {
    const rolePermissions = await this.rolePermission.find({
      where: { roleId },
    });
    const permissionIdsSet = new Set(permissionIds);
    const deleteIds = rolePermissions
      .filter((rp) => !permissionIdsSet.has(rp.permissionId))
      .map((rp) => rp.permissionId);
    const addIds = permissionIds.filter(
      (id) => !rolePermissions.find((rp) => rp.permissionId === id),
    );
    const deleteResult = await this.rolePermission.delete({
      roleId,
      permissionId: In(deleteIds),
    });
    const addResult = await this.rolePermission.insert(
      addIds.map((permissionId) => ({ roleId, permissionId })),
    );

    //只要不报错就返回true，可能不删除权限，也可能权限没有修改
    return (
      deleteResult.affected > 0 ||
      addResult.identifiers.length > 0 ||
      addResult.generatedMaps.length > 0
    );
  }
}
