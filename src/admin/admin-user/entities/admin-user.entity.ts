import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RolePermission } from 'src/admin/admin-permissions/entities/admin-rolePermissions.entity';
import { UserRole } from './admin-userRole.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    comment: '用户组key',
    length: 10,
  })
  roleKey: string;

  @Column({
    type: 'varchar',
    comment: '用户组',
    length: 30,
  })
  label: string;

  @OneToMany(() => RolePermission, (rolePermissions) => rolePermissions.role)
  rolePermissions: RolePermission[];

  @OneToMany(() => UserRole, (userRole) => userRole.roleId)
  userRoles: UserRole[];
}
