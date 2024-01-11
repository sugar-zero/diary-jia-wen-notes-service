import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDiaryDto } from './dto/create-diary.dto';
// import { UpdateDiaryDto } from './dto/update-diary.dto';
import { Diary } from './entities/diary.entity';
import { Like } from '../like/entities/like.entity';
import { Comment } from '../comment/entities/comment.entity';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
  ) {}
  async createDiary({ content, files }: CreateDiaryDto, { userid }) {
    await this.diaryRepository.save({
      content,
      filesList: files,
      user_id: userid,
    });
    const diary = await this.findAll({ userid });
    return {
      message: '📝记录完成！',
      data: diary,
    };
  }

  async findAll({ userid }) {
    if (userid) {
      const diary = await this.diaryRepository
        .createQueryBuilder('diary')
        .leftJoinAndMapOne('diary.author', 'diary.user_id', 'user')
        .leftJoinAndMapMany(
          'diary.likes',
          Like,
          'like',
          'like.diary = diary.id AND like.isLiked = true',
        )
        .leftJoinAndMapMany(
          'diary.comments',
          Comment,
          'comment',
          'comment.diary = diary.id AND comment.isDeleted = false',
        )
        .leftJoinAndMapOne('like.liker', 'like.user', 'like_user')
        .leftJoinAndMapOne(
          'comment.commentator',
          'comment.user',
          'comment_user',
        )
        .where('diary.isDelete = false') //日记没有被删除的
        .orderBy('diary.create_time', 'DESC')
        .addOrderBy('comment.comment_time', 'DESC')
        .addOrderBy('like.like_time', 'ASC')
        .select([
          'diary.id',
          'diary.content',
          'diary.create_time',
          'diary.update_time',
          'diary.filesList',
          'user.nickname',
          'user.username',
          'user.userid',
          'user.avatar',
          'like.like_time',
          'like_user.nickname',
          'like_user.username',
          'like_user.userid',
          'comment.id',
          'comment.content',
          'comment.comment_time',
          'comment_user.nickname',
          'comment_user.username',
          'comment_user.userid',
          'comment_user.avatar',
        ])
        .getMany();
      // console.log(diary);
      diary.forEach((item: any) => {
        // 转换日记所有者显示名
        const owner = item.author.nickname
          ? item.author.nickname
          : item.author.username;
        const ownerId = item.author.userid;
        const ownerAvatar = item.author.avatar;
        item.author = { owner, ownerId, ownerAvatar };
        //转换评论人显示名
        item.comments.forEach((item: any) => {
          const user = item.commentator.nickname
            ? item.commentator.nickname
            : item.commentator.username;
          const userId = item.commentator.userid;
          const userAvatar = item.commentator.avatar;
          item.commentator = { user, userId, userAvatar };
        });
        //转换点赞人显示名
        item.likes.forEach((item: any) => {
          const user = item.liker.nickname
            ? item.liker.nickname
            : item.liker.username;
          const userId = item.liker.userid;
          item.liker = { user, userId };
        });
        const isLiked = item.likes.some(
          (item: any) => item.liker.userId === userid,
        );
        item.isCurrentUserLiked = isLiked;
      });
      // console.log(diary);
      return diary;
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} diary`;
  // }

  async update(patchDiaryData, token) {
    //先鉴权，检查日记所有者是否为更新者
    const diaryOwner = await this.findDiaryOwner(patchDiaryData.id);
    if (diaryOwner.user_id !== token.userid) {
      throw new BadRequestException('这篇日记不属于你,你不能修改它');
    }
    const newFileslist = patchDiaryData.files.map((item: any) => {
      return item.url ? item.url : item.response.data.data;
    });
    // console.log(newFileslist);
    await this.diaryRepository.update(patchDiaryData.id, {
      content: patchDiaryData.content,
      filesList: newFileslist.length > 0 ? newFileslist : null,
      update_time: new Date(),
    });
    return {
      message: '日记更新成功',
    };
  }

  async remove(id: number, token) {
    const diaryOwner = await this.findDiaryOwner(id);
    if (diaryOwner.user_id !== token.userid) {
      throw new BadRequestException('这篇日记不属于你,你不能删除它');
    }
    await this.diaryRepository.update(id, { isDelete: true });
    return {
      message: `#${id} 日记已删除`,
    };
  }

  //用户找日记的所有者，鉴权用
  async findDiaryOwner(id) {
    const diaryOwner = await this.diaryRepository.findOne({
      where: { id: id },
      select: ['user_id'],
    });
    return diaryOwner;
  }
}
