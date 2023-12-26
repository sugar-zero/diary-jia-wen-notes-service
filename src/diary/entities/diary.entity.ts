import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Diary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    comment: '用户id',
    nullable: false,
  })
  @ManyToOne(() => User, (user) => user.diaries)
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @Column({
    type: 'text',
    comment: '日记',
  })
  content: string;

  @Column({
    type: 'boolean',
    comment: '是否标记删除',
    default: false,
  })
  isDelete: boolean;

  @Column({
    type: 'datetime',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  create_time: Date;

  @Column({
    type: 'datetime',
    comment: '更新时间',
    nullable: true,
  })
  update_time: Date;
}