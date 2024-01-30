import { Module } from '@nestjs/common';
import { AdminBlockService } from './admin-block.service';
import { AdminBlockController } from './admin-block.controller';

@Module({
  controllers: [AdminBlockController],
  providers: [AdminBlockService],
})
export class AdminBlockModule {}
