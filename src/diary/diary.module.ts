import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './entities/diary.entity';
import { Like } from '../like/entities/like.entity';
import { Comment } from '../comment/entities/comment.entity';
import { JwtDecrypTool } from '../utils/aes';
import { OssService } from 'src/utils/alioss';

@Module({
  imports: [TypeOrmModule.forFeature([Diary, Like, Comment])],
  controllers: [DiaryController],
  providers: [DiaryService, JwtDecrypTool, OssService],
  exports: [DiaryService],
})
export class DiaryModule {}
