import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class BlockList {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.blockList, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @Column({
    type: 'datetime',
    comment: '开始时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  begin_time: Date;

  @Column({
    type: 'datetime',
    comment: '结束时间',
  })
  end_time: Date;

  @Column({
    type: 'varchar',
    comment: '黑名单提示',
    default: '用户已被停用',
  })
  prompt: string;
}
