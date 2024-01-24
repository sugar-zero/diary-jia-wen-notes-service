import { Module } from '@nestjs/common';
import { AdminDiaryService } from './admin-diary.service';
import { AdminDiaryController } from './admin-diary.controller';

@Module({
  controllers: [AdminDiaryController],
  providers: [AdminDiaryService],
})
export class AdminDiaryModule {}
