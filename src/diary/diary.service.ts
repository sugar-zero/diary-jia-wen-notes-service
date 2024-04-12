import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { CreateDiaryDto } from './dto/create-diary.dto';
// import { UpdateDiaryDto } from './dto/update-diary.dto';
import { Diary } from './entities/diary.entity';
import { Like } from '../like/entities/like.entity';
import { Comment } from '../comment/entities/comment.entity';
import { OssService } from 'src/utils/alioss';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly ossService: OssService,
  ) {}
  async createDiary({ content, files }: CreateDiaryDto, { userid }) {
    await this.diaryRepository.save({
      content,
      filesList: files,
      user_id: userid,
    });
    // const diary = await this.findAll({ userid }); 不再回调日记获取接口
    return {
      message: '📝记录完成！',
      // data: diary,
    };
  }

  async findAll({ userid }: any, { page, size }: any) {
    if (userid) {
      const offset = (page - 1) * size;

      // 查询日记信息
      const diaryQuery = this.diaryRepository
        .createQueryBuilder('diary')
        .leftJoinAndMapOne('diary.author', 'diary.user_id', 'user')
        .where('diary.isDelete = false')
        .orderBy('diary.create_time', 'DESC')
        .take(size)
        .skip(offset)
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
        ]);

      const totalCount = await diaryQuery.getCount();

      const diaries = await diaryQuery.getMany();

      // 分别查询每条日记的点赞和评论
      const diaryIds = diaries.map((d) => d.id);

      const likesPromises = diaryIds.map(async (id) => {
        return this.likeRepository.find({
          where: { diary: Equal(id), isLiked: true },
          relations: ['user'],
        });
      });

      const commentsPromises = diaryIds.map(async (id) => {
        return this.commentRepository.find({
          where: { diary: Equal(id), isDeleted: false },
          relations: ['user'],
        });
      });

      const [likesResult, commentsResult] = await Promise.all([
        Promise.all(likesPromises),
        Promise.all(commentsPromises),
      ]);

      // 将点赞和评论数据与日记数据对应合并async
      const updatedDiaries = diaries.map(async (diary, index) => {
        const likesForThisDiary = likesResult[index];
        const commentsForThisDiary = commentsResult[index];

        const owner = diary.author?.nickname || diary.author?.username;
        const ownerId = diary.author?.userid;
        const ownerAvatar = diary.author.avatar;
        diary.author = { owner, ownerId, ownerAvatar };

        diary.likes = likesForThisDiary.map((like: any) => {
          const user = like.user.nickname || like.user.username;
          const userId = like.user.userid;
          like.liker = { user, userId };
          delete like.user;
          return like;
        });

        diary.comments = commentsForThisDiary.map((comment: any) => {
          const user = comment.user.nickname || comment.user.username;
          const userId = comment.user.userid;
          const userAvatar = comment.user.avatar;
          comment.commentator = { user, userId, userAvatar };
          delete comment.user;
          delete comment.isDeleted;
          return comment;
        });

        const isLiked = diary.likes.some(
          (like: any) => like.liker?.userId === userid,
        );
        diary.isCurrentUserLiked = isLiked;

        if (diary.filesList && Array.isArray(diary.filesList)) {
          diary.filesList = await Promise.all(
            diary.filesList.map(async (file) => {
              const signedUrl = await this.ossService.getFileSignatureUrl(file);
              return signedUrl;
            }),
          );
        }

        // console.log(diary);
        return diary;
      });
      // 确保所有日记更新完成后，再进行返回
      const resolvedUpdatedDiaries = await Promise.all(updatedDiaries);

      return { diaries: resolvedUpdatedDiaries, totalCount };
    }
  }

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
