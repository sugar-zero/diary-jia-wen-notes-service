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
  async createDiary({ content }: CreateDiaryDto, { userid }) {
    await this.diaryRepository.save({
      content,
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
        .leftJoinAndMapOne('diary.nickname', 'diary.user_id', 'user')
        .where('diary.isDelete=false')
        .orderBy('diary.create_time', 'DESC')
        .select([
          'diary.id',
          'diary.content',
          'diary.create_time',
          'user.nickname',
          'user.username',
        ])
        .getMany();
      // console.log(diary);
      diary.forEach((item: any) => {
        item.nickname = item.nickname.nickname
          ? item.nickname.nickname
          : item.nickname.username;
      });
      return diary;
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} diary`;
  // }

  // update(id: number, updateDiaryDto: UpdateDiaryDto) {
  //   return `This action updates a #${id} diary`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} diary`;
  // }
}
