import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { User } from 'src/user/entities/user.entity';
import { Diary } from 'src/diary/entities/diary.entity';
import { Comment } from './entities/comment.entity';
import { SubscribeModule } from 'src/subscribe/subscribe.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, Comment, Diary]), SubscribeModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
