import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';
import { User } from 'src/user/entities/user.entity';
import { Diary } from 'src/diary/entities/diary.entity';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
  ) {}
  async createComment({ userId, diaryId, comment }: CreateCommentDto) {
    const user = await this.userRepository.findOne({
      where: { userid: userId },
    });
    const diary = await this.diaryRepository.findOne({
      where: { id: diaryId },
    });
    await this.commentRepository.save({
      user,
      diary,
      content: comment,
    });
    return {
      code: 200,
      message: '评论成功',
    };
  }

  async removeComment({ userId, commentId }: DeleteCommentDto) {
    const user = await this.userRepository.findOne({
      where: { userid: userId },
    });
    await this.commentRepository.update(
      {
        user,
        id: commentId,
      },
      { isDeleted: true, comment_time: new Date() },
    );
    return {
      code: 200,
      message: '删除成功',
    };
  }
}
