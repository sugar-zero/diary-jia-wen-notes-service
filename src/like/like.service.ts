import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { User } from 'src/user/entities/user.entity';
import { Diary } from 'src/diary/entities/diary.entity';
import { SubscribeService } from 'src/subscribe/subscribe.service';
import { Repository } from 'typeorm';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private readonly LikeRepository: Repository<Like>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    private readonly subscribeService: SubscribeService,
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
    // 点赞的人跟日记作者不是同一人才执行推送检查
    const isSameUser = user.userid === Number(diary.user_id);
    const diaryOwnerId = Number(diary.user_id);
    if (!isSameUser) {
      const userEndpointInfo =
        await this.subscribeService.findUserEndpoint(diaryOwnerId);
      const load = {
        title: '您的日记被点赞了',
        body: `${user.nickname} 点赞了你的日记`,
      };
      if (userEndpointInfo) {
        userEndpointInfo.forEach((item) => {
          // console.log(item);
          this.subscribeService.sendNotification(
            item.endpoint,
            item.expirationTime,
            item.keys,
            load,
          );
        });
      }
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
