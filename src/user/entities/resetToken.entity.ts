import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ResetToekn {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.resetToekn, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @Column({ type: 'varchar', comment: '临时密钥' })
  token: string;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createTime: Date;

  @Column({
    type: 'datetime',
    comment: '过期时间',
  })
  expireTime: Date;

  @Column({
    type: 'boolean',
    default: false,
    comment: '是否使用',
  })
  used: boolean;
}
