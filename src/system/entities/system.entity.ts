import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SystemConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'boolean',
    comment: '是否开启注册',
  })
  allowResgister: boolean;

  @Column({
    type: 'varchar',
    comment: '备案号',
    nullable: true,
  })
  filings: string;

  @Column({
    type: 'varchar',
    comment: '登录页背景地址',
    nullable: true,
  })
  backgroundUrl: string;

  @Column({
    type: 'int',
    comment: '版本号',
    nullable: true,
    default: 100,
  })
  version: number;

  @Column({
    type: 'int',
    comment: '允许差异版本',
    nullable: true,
    default: 10,
  })
  diffVersion: number;
}
