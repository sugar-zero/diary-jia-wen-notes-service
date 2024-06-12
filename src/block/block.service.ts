// import { CreateBanDto } from './dto/create-block.dto';
// import { UpdateBanDto } from './dto/update-block.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { BlockList } from './entities/block.entity';

@Injectable()
export class BanService {
  constructor(
    @InjectRepository(BlockList)
    private readonly blockRepository: Repository<BlockList>,
  ) {}
  // create(createBanDto: CreateBanDto) {
  //   return 'This action adds a new ban';
  // }

  findAll() {
    return `This action returns all ban`;
  }

  async userBlockingStatus(userid: number) {
    return await this.blockRepository.findOne({
      where: {
        user_id: { userid },
        begin_time: LessThanOrEqual(new Date()),
        end_time: MoreThanOrEqual(new Date()),
      },
    });
  }

  // update(id: number, updateBanDto: UpdateBanDto) {
  //   return `This action updates a #${id} ban`;
  // }

  async blockUser(
    userid: number,
    begin_time: number,
    end_time: number,
    prompt: string,
  ) {
    return await this.blockRepository.insert({
      user_id: { userid },
      begin_time: new Date(begin_time),
      end_time: new Date(end_time),
      prompt,
    });
  }
  async unblock(userid: number) {
    const beforeUnblockInfo = await this.blockRepository.findOne({
      where: {
        user_id: { userid },
      },
    });
    return await this.blockRepository.update(userid, {
      end_time: new Date(0),
      prompt: JSON.stringify(beforeUnblockInfo), //保存之前封禁的信息
    });
  }
}
