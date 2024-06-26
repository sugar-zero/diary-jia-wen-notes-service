import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AdminUserLoginDto } from './dto/admin-user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserRole } from './entities/admin-userRole.entity';
import { Role } from './entities/admin-user.entity';
import { RolePermission } from '../admin-permissions/entities/admin-rolePermissions.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { BanService } from 'src/block/block.service';
import { encrypt } from 'src/utils/aes';
import { AdminPermissionsService } from '../admin-permissions/admin-permissions.service';
import { AdminRoleUpdateDto } from './dto/admin-role-update.dto';
import { AdminRoleCreateDto } from './dto/admin-role-create.dto';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(RolePermission)
    private readonly rolePermission: Repository<RolePermission>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly banService: BanService,
    private readonly jwtService: JwtService,
    private readonly adminPermissionsService: AdminPermissionsService,
  ) {}

  /**
   * 执行用户登录操作。
   * @param {AdminUserLoginDto} { username, password } - 包含用户名和密码的对象。
   * @returns {Promise<object>} 登录成功返回包含token和userInfo的对象，否则抛出异常。
   * @throws {BadRequestException} 如果用户名或密码错误。
   * @throws {ForbiddenException} 如果用户被禁用。
   */
  async login({ username, password }: AdminUserLoginDto): Promise<{
    message: string;
    data: {
      token: string;
      userInfo: number;
    };
  }> {
    // 对密码进行加密处理
    password = encrypt(password);
    // 在数据库中查找对应的用户名和密码
    const userInfo = await this.userRepository.findOne({
      where: {
        username,
        password,
      },
    });
    if (userInfo) {
      /**
       * 检查当前用户是否被禁用。
       * 为了保险起见，忽略1号用户的封禁状态。
       * 如果用户被禁用，会删除用户的id字段，并抛出ForbiddenException异常。
       */
      if (userInfo.userid !== 1) {
        // 检查用户是否被禁用
        const userBlockingStatus = await this.banService.userBlockingStatus(
          userInfo.userid,
        );

        if (userBlockingStatus) {
          // 如果用户被禁用，删除id字段并抛出ForbiddenException
          delete userBlockingStatus.id;
          throw new ForbiddenException(userBlockingStatus);
        }
      }
      // 获取用户角色与权限
      const userRoleAndPermission = await this.admin_user_info({
        userid: userInfo.userid,
      });
      // 登录成功，返回成功信息和token
      return {
        message: '登录成功',
        data: {
          token: this.jwtService.sign(
            {
              userid: userInfo.userid,
              username: userInfo.username,
              role: userRoleAndPermission.role,
              permissions: userRoleAndPermission.permissions,
            },
            { expiresIn: '3h' },
          ),
          userInfo: userInfo.userid,
        },
      };
    } else {
      // 如果未找到用户，抛出BadRequestException
      throw new BadRequestException('用户名或密码错误');
    }
  }

  /**
   * 获取用户信息（权限）
   */
  async admin_user_info({ userid }: { userid: number }) {
    const userRoles = await this.userRoleRepository.find({
      where: { userId: userid },
      select: ['roleId'],
    });
    if (!userRoles) {
      throw new BadRequestException('用户无任何权限');
    }
    const userRolesId = userRoles.map((ur) => ur.roleId);
    const rolePermission = await this.rolePermission.find({
      where: { roleId: In(userRolesId) },
      relations: ['permission'],
    });

    //获取角色数据
    const roleInfo = await this.roleRepository.find({
      where: { id: In(userRolesId) },
    });
    // 合并并返回用户的所有权限

    const uniquePermissions = new Set<string>();
    const userPermissions = rolePermission
      .map((rp) => {
        const permissionLabelValue = `${rp.permission.label}:${rp.permission.name}`;
        if (!uniquePermissions.has(permissionLabelValue)) {
          uniquePermissions.add(permissionLabelValue);
          return {
            label: rp.permission.label,
            value: rp.permission.name,
          };
        }
      })
      .filter(Boolean);
    return {
      avatar: 'https://dummyimage.com/234x60',
      permissions: userPermissions,
      role: roleInfo.map((r) => {
        return {
          id: r.id,
          roleKey: r.roleKey,
          label: r.label,
          soft: r.soft,
        };
      }),
    };
  }
  /**
   * 获取角色信息
   */
  async getRole(label?: string): Promise<any> {
    if (label) {
      return await this.roleRepository
        .createQueryBuilder('role')
        .where('role.DeletedAt IS NULL')
        .andWhere('(role.label LIKE :label)', {
          label: `%${label}%`,
        })
        .getMany();
    } else {
      return await this.roleRepository.find({
        where: {
          DeletedAt: IsNull(),
        },
        order: {
          soft: 'DESC',
        },
      });
    }
    // const [list, total] = await this.roleRepository.findAndCount({
    //   skip: (page - 1) * limit,
    //   take: limit,
    // });
    // 计算总页数
    // const pageCount = Math.ceil(total / limit);
    // return {
    //   list,
    // pageInfo: {
    //   current: Number(page),
    //   pageCount,
    //   pagesize: Number(limit),
    //   total,
    // },
    // };
  }

  /**
   * 更新角色信息
   */
  async updateRole(data: AdminRoleUpdateDto, { userinfo }): Promise<any> {
    const role = await this.roleRepository.find({
      where: {
        id: data.id,
      },
    });
    if (!role) {
      throw new BadRequestException('角色不存在');
    }
    try {
      const roleUpdate = await this.roleRepository.update(
        {
          id: data.id,
        },
        {
          soft: data.soft,
          label: data.label,
          UpdatedAt: new Date(),
        },
      );
      if (roleUpdate) {
        if (
          this.adminPermissionsService.UpdateRoleAuth(
            data.id,
            data.permissions,
            userinfo.userid,
          )
        ) {
          return {
            message: '更新成功',
          };
        }
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  /**
   * 创建新角色
   */
  async createRole(data: AdminRoleCreateDto, { userinfo }): Promise<any> {
    //查一下角色是否存在
    const role = await this.roleRepository.findOne({
      where: {
        label: data.label,
      },
    });
    if (role) {
      throw new BadRequestException('角色已存在');
    }

    //随机一个8位有大小字母与数字的组合作为Key
    const roleKey = this.generateKey();
    const roleCreate = await this.roleRepository.save({
      roleKey,
      label: data.label,
      soft: data.soft,
    });
    const createRoleAuth = await this.adminPermissionsService.UpdateRoleAuth(
      roleCreate.id,
      data.permissions,
      userinfo.userid,
    );
    if (createRoleAuth || roleCreate) {
      return {
        message: '角色创建完成',
      };
    }
  }

  //生成随机Key
  private generateKey(length: number = 8): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters[randomIndex];
    }

    return result;
  }

  /**
   * 查询被删除的角色
   */
  async getRoleRecycle(label) {
    if (label) {
      return await this.roleRepository
        .createQueryBuilder('permissions')
        .where('role.DeletedAt IS NOT NULL')
        .andWhere('(role.label LIKE :label)', {
          label: `%${label}%`,
        })
        .withDeleted()
        .getMany();
    } else {
      return await this.roleRepository.find({
        where: {
          DeletedAt: Not(IsNull()),
        },
        withDeleted: true,
      });
    }
  }
  /**
   * 软删除角色
   */
  async softDeleteRole(id: number) {
    const role = await this.roleRepository.findOne({
      where: {
        id,
        DeletedAt: IsNull(),
      },
    });
    if (!role) {
      throw new BadRequestException('角色不存在');
    }
    //角色是否有用户
    const roleUser = await this.userRoleRepository.find({
      where: {
        roleId: id,
      },
    });
    if (roleUser.length) {
      throw new BadRequestException(`该角色已授权到用户，请先取消授权`);
    }
    const deleteResult = await this.roleRepository.softDelete(id);
    if (deleteResult.affected) {
      return {
        message: '角色删除成功',
      };
    } else {
      throw new BadRequestException('角色删除失败');
    }
  }

  /**
   * 硬删除角色
   */
  async hardDeleteRole(id: number) {
    const role = await this.roleRepository.findOne({
      where: {
        id,
        DeletedAt: IsNull(),
      },
    });
    if (!role) {
      throw new BadRequestException('角色不存在');
    }
    //角色是否有用户
    const roleUser = await this.userRoleRepository.find({
      where: {
        roleId: id,
      },
    });
    if (roleUser.length) {
      throw new BadRequestException(`该角色已授权到用户，请先取消授权`);
    }
    try {
      const deleteResult = await this.roleRepository.delete({ id: id });
      if (deleteResult.affected) {
        return {
          message: '角色删除成功',
        };
      } else {
        throw new BadRequestException('角色删除失败');
      }
    } catch (e) {
      throw new BadRequestException('您要先卸载该角色的权限才能继续操作');
    }
  }

  /**
   * 回滚角色
   */
  async rollbackRole(id: number) {
    const permission = await this.roleRepository.findOne({
      where: {
        id,
      },
      withDeleted: true,
    });
    if (!permission) {
      throw new BadRequestException('角色不存在');
    }
    permission.DeletedAt = null;
    const rollbackResult = await this.roleRepository.save(permission);
    if (rollbackResult) {
      return {
        message: '角色恢复成功',
      };
    }
  }

  //  用户列表
  async userList(name?: string): Promise<any> {
    const currentTime = new Date();
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRoles', 'userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .leftJoinAndSelect(
        'user.blockList',
        'blockList',
        'blockList.end_time > :currentTime',
        { currentTime },
      )
      .select([
        'user.userid',
        'user.nickname',
        'user.username',
        'user.signature',
        'user.email',
        'blockList.begin_time',
        'blockList.end_time',
        'blockList.prompt',
        'userRole',
        'role.id',
        'role.roleKey',
        'role.label',
      ]);

    // 根据名称进行过滤
    if (name) {
      queryBuilder.where(
        '(user.username LIKE :name OR user.nickname LIKE :name)',
        {
          name: `%${name}%`,
        },
      );
    }
    const userList = await queryBuilder.getMany();
    const modifiedUserList = userList.map((user) => {
      const roles = user.userRoles.map((userRole) => userRole.role);
      delete user.userRoles;
      return {
        ...user,
        roles,
      };
    });
    return modifiedUserList;
    // 计算总页数
    // const pageCount = Math.ceil(total / limit);
    // return {
    //   list,
    // pageInfo: {
    //   current: Number(page),
    //   pageCount,
    //   pagesize: Number(limit),
    //   total,
    // },
    // };
  }
  async fetchRoles({ userid }) {
    const isSuper = await this.adminPermissionsService.filter(
      userid,
      ['super'],
      true,
    );
    let roles = await this.roleRepository.find({
      select: ['id', 'roleKey', 'label'],
    });

    if (!isSuper) {
      //去掉超管与管理
      roles = roles.filter((role) => {
        return role.roleKey !== 'BQ3KwE2l' && role.roleKey !== 'zpPFNnXd';
      });
    }
    return roles;
  }

  async blockUser({
    userid,
    blockList,
    prompt,
  }: {
    userid: number;
    blockList: Array<number>;
    prompt: string;
  }) {
    const begin_time = blockList[0];
    const end_time = blockList[1];
    if (begin_time > end_time) {
      throw new BadRequestException('结束时间不能早于开始时间');
    }
    if (begin_time === end_time) {
      throw new BadRequestException('结束时间不能与开始时间相同');
    }
    const blockResult = await this.banService.blockUser(
      userid,
      begin_time,
      end_time,
      prompt,
    );
    if (blockResult) {
      return {
        message: '已禁止用户',
      };
    } else {
      throw new BadRequestException('禁止失败');
    }
  }
  async unblockUser(userid: number) {
    const currentTime = new Date();
    const blockUser = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.blockList',
        'blockList',
        'blockList.end_time > :currentTime',
        { currentTime },
      )
      .where('user.userid = :userid', { userid })
      .getOne();
    if (!blockUser) {
      throw new BadRequestException('用户不存在');
    } else {
      const unblockResult = await this.banService.unblock(userid);
      if (unblockResult) {
        return {
          message: '解封成功',
        };
      } else {
        throw new BadRequestException('解封失败');
      }
    }
  }

  async createUser(body) {
    return { ...body, message: '后台注册用户功能尚未完成' };
  }

  async updateUser(body, { userid }) {
    const user = await this.userRepository.findOne({
      where: {
        userid: body.userid,
      },
    });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    // 是否有用户角色编辑权限
    const userRolesAuth = await this.adminPermissionsService.filter(
      userid,
      ['user:roles'],
      true,
    );

    await this.userRepository.save({
      email: body.email,
      nickname: body.nickname,
      signature: body.signature,
      userid: body.userid,
    });
    if (userRolesAuth) {
      await this.updateUserRoles(body.userid, body.roles);
    }
    return {
      message: '更新成功',
    };
  }

  async updateUserRoles(userid: number, roleIds: number[]) {
    const userRoles = await this.userRoleRepository.find({
      where: { userId: userid },
    });

    const roleIdsSet = new Set(roleIds);

    const deleteIds = userRoles
      .filter((ur) => !roleIdsSet.has(ur.roleId))
      .map((ur) => ur.roleId);

    // 如果要删除的权限中包含超管权限，检查一下是否还有其他超级管理员，如果是唯一则不允许删除
    if (deleteIds.includes(1)) {
      const superAdmins = await this.userRoleRepository.find({
        where: { roleId: 1 },
      });
      if (superAdmins.length === 1) {
        throw new BadRequestException('请至少拥有一位超级管理员');
      } else if (superAdmins[0].userId === userid) {
        throw new BadRequestException('你不能解除自己的超级管理员');
      }
    }

    const addIds = roleIds.filter(
      (id) => !userRoles.find((ur) => ur.roleId === id),
    );
    // console.log('userRoles:', userRoles);
    // console.log('addIds:', addIds);
    // console.log('deleteIds:', deleteIds);

    const deleteResult = await this.userRoleRepository.delete({
      userId: userid,
      roleId: In(deleteIds),
    });

    const addResult = await this.userRoleRepository.insert(
      addIds.map((roleId) => ({ userId: userid, roleId })),
    );

    return (
      deleteResult.affected > 0 ||
      addResult.identifiers.length > 0 ||
      addResult.generatedMaps.length > 0
    );
  }
}
