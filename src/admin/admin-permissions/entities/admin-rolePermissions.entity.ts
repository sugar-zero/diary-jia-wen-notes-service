import { Entity, PrimaryColumn, ManyToOne } from 'typeorm';
import { Role } from '../../admin-user/entities/admin-user.entity';
import { Permissions } from './admin-permission.entity';

@Entity()
export class RolePermission {
  @PrimaryColumn()
  roleId: number;

  @PrimaryColumn()
  permissionId: number;

  @ManyToOne(() => Role, (role) => role.rolePermissions)
  role: Role;

  @ManyToOne(() => Permissions, (permissions) => permissions.rolePermissions)
  permission: Permissions;
}
