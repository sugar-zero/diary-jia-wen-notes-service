import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
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

  @Column({
    type: 'int',
    comment: '越大权限等级越高，最大255',
    default: 0,
  })
  soft: number;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  CreatedAt: Date;

  @Column({ nullable: true, comment: '更新时间' })
  UpdatedAt: Date;

  @DeleteDateColumn({ nullable: true, comment: '删除时间' })
  DeletedAt: Date;

  @OneToMany(() => RolePermission, (rolePermissions) => rolePermissions.role)
  rolePermissions: RolePermission[];

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}
