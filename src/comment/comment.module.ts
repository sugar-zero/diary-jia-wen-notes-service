import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { User } from 'src/user/entities/user.entity';
import { Diary } from 'src/diary/entities/diary.entity';
import { Comment } from './entities/comment.entity';
import { Subscribe } from 'src/subscribe/entities/subscribe.entity';
import { SubscribeService } from 'src/subscribe/subscribe.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, Comment, Diary, Subscribe])],
  controllers: [CommentController],
  providers: [CommentService, SubscribeService],
})
export class CommentModule {}
