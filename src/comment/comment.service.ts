import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';
import { User } from 'src/user/entities/user.entity';
import { Diary } from 'src/diary/entities/diary.entity';
import { Comment } from './entities/comment.entity';
import { SubscribeService } from 'src/subscribe/subscribe.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    private readonly subscribeService: SubscribeService,
  ) {}
  async createComment({ userId, diaryId, comment }: CreateCommentDto) {
    const user = await this.userRepository.findOne({
      where: { userid: userId },
    });
    const diary = await this.diaryRepository.findOne({
      where: { id: diaryId },
    });
    const CommentProcessing = comment as {
      reply?: { user: string; userId: number };
      content: string;
    };
    //如果有reply执行回复评论
    if (CommentProcessing.reply) {
      await this.commentRepository.save({
        user,
        diary,
        content: `回复@${CommentProcessing.reply.user} ${CommentProcessing.content}`,
      });
    } else {
      await this.commentRepository.save({
        user,
        diary,
        content: CommentProcessing.content,
      });
    }
    //消息推送，如果回复的就是日记作者就推送一条否则分别推送作者与评论作者
    const diaryOwnerId = await this.diaryRepository.findOne({
      where: { id: diaryId },
      select: ['user_id'],
    });
    const commentUser = await this.userRepository.findOne({
      where: { userid: userId },
      select: ['username', 'nickname'],
    });
    if (CommentProcessing.reply) {
      if (Number(diaryOwnerId.user_id) === CommentProcessing.reply.userId) {
        const load = {
          title: `${
            commentUser.nickname ? commentUser.nickname : commentUser.username
          }评论（回复）了您的日记`,
          body: CommentProcessing.content,
        };
        const userEndpointInfo = await this.subscribeService.findUserEndpoint(
          Number(diaryOwnerId.user_id),
        );
        if (userEndpointInfo) {
          userEndpointInfo.forEach((item) => {
            this.subscribeService.sendNotification(
              item.endpoint,
              item.expirationTime,
              item.keys,
              load,
            );
          });
        }
      } else {
        const commentLoad = {
          title: `${CommentProcessing.reply.user}评论了您的日记`,
          body: CommentProcessing.content,
        };
        const replyLoad = {
          title: `${CommentProcessing.reply.user}回复了您的评论`,
          body: CommentProcessing.content,
        };
        const ownerEndpointInfo = await this.subscribeService.findUserEndpoint(
          Number(diaryOwnerId.user_id),
        );
        const commentOwnerEndpointInfo =
          await this.subscribeService.findUserEndpoint(
            CommentProcessing.reply.userId,
          );
        if (ownerEndpointInfo) {
          ownerEndpointInfo.forEach((item) => {
            this.subscribeService.sendNotification(
              item.endpoint,
              item.expirationTime,
              item.keys,
              commentLoad,
            );
          });
        }
        if (commentOwnerEndpointInfo) {
          ownerEndpointInfo.forEach((item) => {
            this.subscribeService.sendNotification(
              item.endpoint,
              item.expirationTime,
              item.keys,
              replyLoad,
            );
          });
        }
      }
    } else {
      const userEndpointInfo = await this.subscribeService.findUserEndpoint(
        Number(diaryOwnerId.user_id),
      );
      const load = {
        title: `${
          commentUser.nickname ? commentUser.nickname : commentUser.username
        }评论了您的日记`,
        body: CommentProcessing.content,
      };
      if (userEndpointInfo) {
        userEndpointInfo.forEach((item) => {
          this.subscribeService.sendNotification(
            item.endpoint,
            item.expirationTime,
            item.keys,
            load,
          );
        });
      }
    }
    return {
      code: 200,
      message: '评论成功',
    };
  }

  async removeComment({ userId, commentId }: DeleteCommentDto) {
    const user = await this.userRepository.findOne({
      where: { userid: userId },
    });
    await this.commentRepository.update(
      {
        user,
        id: commentId,
      },
      { isDeleted: true, comment_time: new Date() },
    );
    return {
      code: 200,
      message: '删除成功',
    };
  }
}
