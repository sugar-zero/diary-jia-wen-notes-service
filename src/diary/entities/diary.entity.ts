import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Like } from '../../like/entities/like.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity()
export class Diary {
  @PrimaryGeneratedColumn({
    comment: '日记id',
  })
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
    nullable: true,
    default: null,
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

  @Column({
    type: 'json',
    comment: '附件列表',
    nullable: true,
    default: null,
  })
  filesList: object;

  // 一个日记对应多个点赞
  @OneToMany(() => Like, (like) => like.diary)
  likes: Like[];

  // 一个日记对应多个评论
  @OneToMany(() => Comment, (comment) => comment.diary)
  comments: Comment[];
}
