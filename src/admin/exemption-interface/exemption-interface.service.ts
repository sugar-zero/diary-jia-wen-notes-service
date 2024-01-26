import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExemptionInterface } from './entities/exemption-interface.entity';

@Injectable()
export class ExemptionInterfaceService {
  constructor(
    @InjectRepository(ExemptionInterface)
    private readonly ExemptionInterfaceRepository: Repository<ExemptionInterface>,
  ) {}

  // create() {
  //   return 'This action adds a new exemptionInterface';
  // }

  /**
   * 获取认证豁免的接口
   * @returns {Promise<any[]>} 返回认证豁免的接口数组
   */
  async exemptionAuthentication() {
    const exemptionInterfaceResult =
      await this.ExemptionInterfaceRepository.find({
        where: {
          exemptionAuthentication: true,
        },
        select: ['routingInterface', 'method'],
      });
    const exemptionInterface = [];
    exemptionInterfaceResult.forEach((item) => {
      exemptionInterface.push(item.routingInterface);
    });
    return exemptionInterfaceResult;
  }
  /**
   * 获取维护检修接口
   * @returns {Promise<Array<any>>} 返回维护检修接口数组
   */
  async inspectionGallery() {
    const inspectionGalleryResult =
      await this.ExemptionInterfaceRepository.find({
        where: {
          inspectionGallery: true,
        },
        select: ['routingInterface'],
      });
    const inspectionGallery = [];
    inspectionGalleryResult.forEach((item) => {
      inspectionGallery.push(item.routingInterface);
    });
    return inspectionGallery;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} exemptionInterface`;
  // }

  // update(id: number, updateExemptionInterfaceDto: UpdateExemptionInterfaceDto) {
  //   return `This action updates a #${id} exemptionInterface`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} exemptionInterface`;
  // }
}
