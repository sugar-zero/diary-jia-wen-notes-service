import { Module } from '@nestjs/common';
import { AdminSubscribeService } from './admin-subscribe.service';
import { AdminSubscribeController } from './admin-subscribe.controller';

@Module({
  controllers: [AdminSubscribeController],
  providers: [AdminSubscribeService],
})
export class AdminSubscribeModule {}
