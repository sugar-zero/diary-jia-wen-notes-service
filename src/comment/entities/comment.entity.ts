// comment.entity.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Diary } from '../../diary/entities/diary.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  // 评论的用户
  @ManyToOne(() => User, (user) => user.comments, { nullable: false })
  user: User;

  // 被评论的日记
  @ManyToOne(() => Diary, (diary) => diary.comments, { nullable: false })
  diary: Diary;

  @Column({
    type: 'text',
    comment: '评论内容',
  })
  content: string;

  @Column({
    type: 'datetime',
    comment: '评论时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  comment_time: Date;

  @Column({
    type: 'boolean',
    comment: '是否删除评论',
    default: false,
  })
  isDeleted: boolean;
}
