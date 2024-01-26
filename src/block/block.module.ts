import { Module } from '@nestjs/common';
import { BanService } from './block.service';
import { BanController } from './block.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockList } from './entities/block.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlockList])],
  controllers: [BanController],
  providers: [BanService],
  exports: [BanService],
})
export class BanModule {}
