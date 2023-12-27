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
    comment: '背景地址',
    nullable: true,
  })
  backgroundUrl: string;

  @Column({
    type: 'int',
    comment: '版本号',
    nullable: true,
  })
  version: number;

  @Column({
    type: 'int',
    comment: '允许差异版本',
    nullable: true,
  })
  diffversion: number;
}
