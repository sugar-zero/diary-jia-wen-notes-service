import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Subscribe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    comment: '订阅用户id',
    nullable: false,
  })
  @ManyToOne(() => User, (user) => user.subscribe)
  @JoinColumn({ name: 'user_id' })
  user_id: number;

  @Column({
    type: 'varchar',
    length: 10000,
    comment: '订阅端点',
    nullable: false,
  })
  endpoint: string;

  @Column({
    type: 'datetime',
    comment: '过期时间',
    nullable: true,
    default: null,
  })
  expirationTime: Date;

  @Column({
    type: 'json',
    comment: '密钥信息',
    nullable: false,
  })
  keys: object;

  @Column({
    type: 'boolean',
    comment: '订阅是否有效',
    default: 1,
    nullable: false,
  })
  effective: boolean;
}
