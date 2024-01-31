import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './entities/diary.entity';
import { JwtDecrypTool } from '../utils/aes';
import { OssService } from 'src/utils/alioss';

@Module({
  imports: [TypeOrmModule.forFeature([Diary])],
  controllers: [DiaryController],
  providers: [DiaryService, JwtDecrypTool, OssService],
  exports: [DiaryService],
})
export class DiaryModule {}
