import { Injectable } from '@nestjs/common';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
// import { UpdateSubscribeDto } from './dto/update-subscribe.dto';
import { Subscribe } from './entities/subscribe.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const WebPush = require('web-push');
import { subscribeNotificationInfo as prodSubscribeNotificationInfo } from '../config.prod';
import { subscribeNotificationInfo as devSubscribeNotificationInfo } from '../config.dev';

@Injectable()
export class SubscribeService {
  constructor(
    @InjectRepository(Subscribe)
    private readonly subscribeRepository: Repository<Subscribe>,
  ) {}

  /**
   * 创建订阅
   * @param endpoint - 订阅端点
   * @param expirationTime - 订阅过期时间
   * @param keys - 订阅密钥
   * @param userid - 用户ID
   */
  async createSubscribe(
    { endpoint, expirationTime, keys }: CreateSubscribeDto,
    { userid },
  ) {
    // 查询该客户端是否已有订阅信息，有则不进行重复记录
    const userEndpoint = await this.findOneEndpoint(userid, endpoint);
    if (userEndpoint) {
      const load = {
        title: '订阅失败',
        body: '本客户端订阅已存在，无需重复订阅',
      };
      // 推送一条信息给用户提示订阅已存在
      this.sendNotification(
        userEndpoint.endpoint,
        userEndpoint.expirationTime,
        userEndpoint.keys,
        load,
      );
    } else {
      await this.subscribeRepository.save({
        endpoint,
        expirationTime,
        keys,
        user_id: userid,
      });
      const load = {
        title: '订阅成功',
        body: '消息推送将会在其他用户对您的日记进行评论，点赞时候进行通知提醒',
      };
      // 推送一条订阅成功的通知消息
      this.sendNotification(endpoint, expirationTime, keys, load);
    }
  }

  // 查找这个用户是否在某个客户端订阅了推送
  /**
   * 根据用户ID和端点查询订阅记录
   * @param user_id 用户ID
   * @param endpoint 端点
   * @returns 返回查询到的订阅记录
   */
  async findOneEndpoint(user_id: number, endpoint: string) {
    return await this.subscribeRepository.findOne({
      where: {
        user_id: user_id,
        endpoint: endpoint,
      },
    });
  }

  /**
   * 根据用户ID查找用户端点
   * @param user_id 用户ID
   * @returns 找到的用户端点
   */
  async findUserEndpoint(user_id: number) {
    return await this.subscribeRepository.findBy({
      user_id: user_id,
      effective: true,
    });
  }

  /**
   * 发送通知到指定的设备
   * @param endpoint 设备端点
   * @param expirationTime 过期时间
   * @param keys 设备密钥
   * @param load 要发送的通知内容
   */
  async sendNotification(endpoint, expirationTime, keys, load) {
    // 根据环境选择订阅通知的信息
    const SubscribeNotificationInfo =
      process.env.NODE_ENV === 'prod'
        ? prodSubscribeNotificationInfo
        : devSubscribeNotificationInfo;

    // 设置VAPID详情
    WebPush.setVapidDetails(
      'mailto:me@amesucre.com', // 可以改成自己的邮箱或网址
      SubscribeNotificationInfo.publicKey,
      SubscribeNotificationInfo.privateKey,
    );

    // 构建推送订阅对象
    const pushSubscription = {
      endpoint: endpoint,
      expirationTime: expirationTime,
      keys: {
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
    };

    // 构建推送通知的payload
    const payload = JSON.stringify({
      title: load.title,
      body: load.body,
    });
    // console.log(pushSubscription);

    // 发送推送通知
    await WebPush.sendNotification(pushSubscription, payload)
      .then((res: any) => {
        console.log(res);
      })
      .catch((e: any) => {
        this.updateSubscribe(pushSubscription);
        console.log(e);
      });
  }

  // 如果某个客户端推送失败了那就标记为无效订阅以后不再给这个客户端推送了
  async updateSubscribe(Subscription: { endpoint: any }) {
    await this.subscribeRepository.update(
      { endpoint: Subscription.endpoint },
      { effective: false },
    );
  }
}
