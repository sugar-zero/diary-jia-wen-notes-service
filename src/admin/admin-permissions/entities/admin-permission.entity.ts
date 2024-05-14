import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolePermission } from './admin-rolePermissions.entity';

@Entity()
export class Permissions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '权限名称' })
  name: string;

  @Column({ comment: '权限描述' })
  label: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP', comment: '创建时间' })
  CreatedAt: Date;

  @Column({ nullable: true, comment: '更新时间' })
  UpdatedAt: Date;

  @Column({ nullable: true, comment: '删除时间' })
  DeletedAt: Date;

  @OneToMany(
    () => RolePermission,
    (rolePermissions) => rolePermissions.permissionId,
  )
  rolePermissions: RolePermission[];
}
