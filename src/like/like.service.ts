import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { User } from 'src/user/entities/user.entity';
import { Diary } from 'src/diary/entities/diary.entity';
import { Repository } from 'typeorm';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly LikeRepository: Repository<Like>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
  ) {}
  async like({ userId, diaryId }: CreateLikeDto) {
    const user = await this.userRepository.findOne({
      where: { userid: userId },
    });
    const diary = await this.diaryRepository.findOne({
      where: { id: diaryId },
    });
    const isLiked = await this.LikeRepository.createQueryBuilder('like')
      .where('like.userUserid = :user', { user: user.userid })
      .andWhere('like.diaryId = :diary', { diary: diary.id })
      .getOne();
    if (isLiked) {
      await this.LikeRepository.update(
        {
          user,
          diary,
        },
        { isLiked: true, like_time: new Date() },
      );
    } else {
      await this.LikeRepository.save({
        user,
        diary,
      });
    }
    return {
      code: 200,
      message: '点赞成功',
    };
  }

  async cancelLike({ userId, diaryId }: CreateLikeDto) {
    const user = await this.userRepository.findOne({
      where: { userid: userId },
    });
    const diary = await this.diaryRepository.findOne({
      where: { id: diaryId },
    });
    await this.LikeRepository.update(
      {
        user,
        diary,
      },
      { isLiked: false, like_time: new Date() },
    );
    return {
      code: 200,
      message: '已取消点赞',
    };
  }
}
