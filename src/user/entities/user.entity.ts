import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ comment: '用户ID' })
  userid: number;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
    comment: '用户名',
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 20,
    unique: false,
    comment: '昵称',
  })
  nickname: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: false,
    comment: '邮箱',
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: false,
    comment: '密码',
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: false,
    comment: '签名',
    nullable: true,
    default: '还没有设定签名哦~',
  })
  signature: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: false,
    comment: '头像',
    nullable: true,
  })
  avatar: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: false,
    comment: '用户背景',
    nullable: true,
  })
  userBg: string;
}
