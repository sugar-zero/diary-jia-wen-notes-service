import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemConfig } from './entities/system.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(SystemConfig)
    private readonly systemConfigRepository: Repository<SystemConfig>,
  ) {}
  async GetInfo() {
    const systemConfig = await this.systemConfigRepository.find({
      select: [
        'allowResgister',
        'filings',
        'backgroundUrl',
        'version',
        'diffVersion',
        'maintenance',
      ],
    });
    // console.log(_systemConfig);
    return {
      message: '系统信息已加载',
      data: systemConfig[0],
    };
  }

  // update(id: number, updateSystemDto: UpdateSystemDto) {
  //   return `This action updates a #${id} system`;
  // }
}
