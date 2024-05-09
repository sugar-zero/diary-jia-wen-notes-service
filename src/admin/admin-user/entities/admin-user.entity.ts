import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserRole {
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
    type: 'json',
    comment: '权限组',
  })
  permission: object;
}
