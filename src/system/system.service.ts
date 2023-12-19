import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemConfig } from './entities/system.entity';
import { Repository } from 'typeorm';
// import { UpdateSystemDto } from './dto/update-system.dto';

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(SystemConfig)
    private readonly systemConfigRepository: Repository<SystemConfig>,
  ) {}
  async GetInfo() {
    const systemConfig = await this.systemConfigRepository.find({});
    const _systemConfig = systemConfig.map((item: any) => {
      delete item.id;
      return item;
    });
    // console.log(_systemConfig);
    return {
      message: '系统信息已加载',
      data: _systemConfig[0],
    };
  }

  // update(id: number, updateSystemDto: UpdateSystemDto) {
  //   return `This action updates a #${id} system`;
  // }
}
