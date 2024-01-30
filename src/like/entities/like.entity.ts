// like.entity.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Diary } from '../../diary/entities/diary.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  // 点赞的用户
  @ManyToOne(() => User, (user) => user.likes, { nullable: false })
  user: User;

  // 被点赞的日记
  @ManyToOne(() => Diary, (diary) => diary.likes, { nullable: false })
  diary: Diary;

  @Column({
    type: 'datetime',
    comment: '点赞时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  like_time: Date;

  @Column({
    type: 'boolean',
    comment: '是否点赞',
    default: true, // 初始状态为已点赞
  })
  isLiked: boolean;
}
