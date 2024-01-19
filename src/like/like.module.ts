import { Module } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Like } from './entities/like.entity';
import { Diary } from 'src/diary/entities/diary.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeService } from './like.service';
import { Subscribe } from 'src/subscribe/entities/subscribe.entity';
import { SubscribeService } from 'src/subscribe/subscribe.service';
import { LikeController } from './like.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Like, Diary, Subscribe])],
  controllers: [LikeController],
  providers: [LikeService, SubscribeService],
})
export class LikeModule {}
