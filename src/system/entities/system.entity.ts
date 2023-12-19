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
  })
  filings: string;

  @Column({
    type: 'varchar',
    comment: '背景地址',
  })
  backgroundUrl: string;
}
