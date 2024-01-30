import { Module } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Like } from './entities/like.entity';
import { Diary } from 'src/diary/entities/diary.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeService } from './like.service';
import { SubscribeModule } from 'src/subscribe/subscribe.module';
import { LikeController } from './like.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Like, Diary]), SubscribeModule],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
