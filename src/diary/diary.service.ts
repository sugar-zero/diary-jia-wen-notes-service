import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDiaryDto } from './dto/create-diary.dto';
// import { UpdateDiaryDto } from './dto/update-diary.dto';
import { Diary } from './entities/diary.entity';

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
        .where('diary.isDelete=false')
        .orderBy('diary.create_time', 'DESC')
        .select([
          'diary.id',
          'diary.content',
          'diary.create_time',
          'diary.update_time',
          'diary.filesList',
          'user.nickname',
          'user.username',
        ])
        .getMany();
      // console.log(diary);
      diary.forEach((item: any) => {
        item.author = item.author.nickname
          ? item.author.nickname
          : item.author.username;
      });
      return diary;
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} diary`;
  // }

  async update(patchDiaryData) {
    const newFileslist = patchDiaryData.files.map((item: any) => {
      return item.url;
    });
    await this.diaryRepository.update(patchDiaryData.id, {
      content: patchDiaryData.content,
      filesList: newFileslist ? null : newFileslist,
      update_time: new Date(),
    });
    return {
      message: '日记更新成功',
    };
  }

  async remove(id: number) {
    await this.diaryRepository.update(id, { isDelete: true });
    return {
      message: `#${id} 日记已删除`,
    };
  }
}
