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
    //消息推送
    const diaryOwnerId = await this.diaryRepository.findOne({
      where: { id: diaryId },
      select: ['user_id'],
    });
    const commentUser = await this.userRepository.findOne({
      where: { userid: userId },
      select: ['username', 'nickname'],
    });
    // 三种情况：前两种评论的均不能是作者否则会重复推送或自己推自己
    // 他人回复作者：推送给作者
    // 他人回复他人：推送给作者与被会回复者
    // 作者回复他人：推送给呗回复者
    // 如果是回复他人
    if (CommentProcessing.reply) {
      if (
        CommentProcessing.reply.userId === Number(diaryOwnerId.user_id) &&
        userId !== Number(diaryOwnerId.user_id)
      ) {
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
      } else if (
        CommentProcessing.reply.userId !== Number(diaryOwnerId.user_id) &&
        userId !== Number(diaryOwnerId.user_id)
      ) {
        const commentLoad = {
          title: `${
            commentUser.nickname ? commentUser.nickname : commentUser.username
          }评论（回复${CommentProcessing.reply.user}）了您的日记`,
          body: CommentProcessing.content,
        };
        const replyLoad = {
          title: `${
            commentUser.nickname ? commentUser.nickname : commentUser.username
          }回复了您的评论`,
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
          commentOwnerEndpointInfo.forEach((item) => {
            this.subscribeService.sendNotification(
              item.endpoint,
              item.expirationTime,
              item.keys,
              replyLoad,
            );
          });
        }
      } else {
        const replyLoad = {
          title: `${
            commentUser.nickname ? commentUser.nickname : commentUser.username
          }回复了您的评论`,
          body: CommentProcessing.content,
        };
        const commentOwnerEndpointInfo =
          await this.subscribeService.findUserEndpoint(
            CommentProcessing.reply.userId,
          );
        if (commentOwnerEndpointInfo) {
          commentOwnerEndpointInfo.forEach((item) => {
            this.subscribeService.sendNotification(
              item.endpoint,
              item.expirationTime,
              item.keys,
              replyLoad,
            );
          });
        }
      }
      // 不是回复他人而是评论
    } else {
      //评论者不是日记作者才执行
      if (Number(diaryOwnerId.user_id) !== userId) {
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
