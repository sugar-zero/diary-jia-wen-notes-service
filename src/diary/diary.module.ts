import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './entities/diary.entity';
import { JwtDecrypTool } from '../utils/aes';

@Module({
  imports: [TypeOrmModule.forFeature([Diary])],
  controllers: [DiaryController],
  providers: [DiaryService, JwtDecrypTool],
  exports: [DiaryService],
})
export class DiaryModule {}
