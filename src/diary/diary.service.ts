import { BadRequestException, Injectable } from '@nestjs/common';
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
          'user.userid',
        ])
        .getMany();
      // console.log(diary);
      diary.forEach((item: any) => {
        const owner = item.author.nickname
          ? item.author.nickname
          : item.author.username;
        const ownerid = item.author.userid;
        item.author = { owner, ownerid };
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
