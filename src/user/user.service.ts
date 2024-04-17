import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RegisterDto } from './dto/register-dto';
import { UserLoginDto } from './dto/userlogin-dto';
import { UpdateSecurityDto } from './dto/update-security-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ResetToekn } from './entities/resetToken.entity';
import { SystemService } from 'src/system/system.service';
import { BanService } from 'src/block/block.service';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { encrypt } from '../utils/aes';
import { MailService } from 'src/mail/mail.service';
import { OssService } from 'src/utils/alioss';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(ResetToekn)
    private readonly resetToekn: Repository<ResetToekn>,
    private readonly systemService: SystemService,
    private readonly banService: BanService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly ossService: OssService,
  ) {}
  /**
   * 注册新用户
   * @param {RegisterDto} 注册信息对象
   * @param {string} params.username 用户名
   * @param {string} params.password 密码
   * @param {string} params.email 邮箱
   * @param {string} params.nickname 昵称
   * @returns {Promise} 返回注册结果
   */
  async register({
    username,
    password,
    email,
    nickname,
  }: RegisterDto): Promise<any> {
    // 判断是否开启注册
    const allowResgister = await this.systemService.GetInfo();
    if (!allowResgister.data.allowResgister)
      throw new BadRequestException('注册已关闭');

    // 查找用户是否存在
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
    if (user) {
      throw new BadRequestException('用户已注册');
    }

    // 加密密码
    password = encrypt(password);

    // 随机生成昵称
    nickname = !nickname
      ? 'JW_' + Math.random().toString(30).slice(-8)
      : nickname;

    // 保存新用户信息
    const newUser = await this.userRepository.save({
      username,
      password,
      email,
      nickname,
    });

    // 返回注册结果
    return {
      message: '注册成功(注册自动登录有效期1小时)',
      data: {
        token: this.jwtService.sign(
          {
            userid: newUser.userid,
            username: newUser.username,
          },
          { expiresIn: '1h' },
        ),
      },
    };
  }

  /**
   * 获取用户信息
   */
  async GetUserInfo({ username }) {
    // 调用用户仓库，通过用户名查询用户信息
    const userInfo = await this.userRepository.findOne({
      where: {
        username,
      },
      select: ['username', 'nickname', 'signature', 'avatar', 'userBg'],
    });
    // 返回查询到的用户信息
    userInfo.avatar = await this.ossService.getFileSignatureUrl(
      userInfo.avatar,
    );
    userInfo.userBg = await this.ossService.getFileSignatureUrl(
      userInfo.userBg,
    );
    return {
      data: userInfo,
    };
  }

  /**
   * 更新用户信息
   * @param {Object} params - 参数对象
   * @param {string} params.nickname - 昵称
   * @param {string} params.signature - 签名
   * @param {string} params.avatar - 头像
   * @param {string} params.userBg - 用户背景
   * @param {string} params.username - 用户名
   * @returns {Promise<Object>} - 返回一个Promise对象，包含修改成功的信息和更新后的用户信息
   */
  async UpdateUserInfo(
    {
      nickname,
      signature,
      avatar,
      userBg,
    }: {
      nickname: string;
      signature: string;
      avatar: string;
      userBg: string;
      username: string;
    },
    { username },
  ): Promise<object> {
    await this.userRepository.update(
      { username },
      {
        nickname,
        signature,
        avatar,
        userBg,
      },
    );
    // console.log(updateinfo);
    const userInfo = await this.userRepository.findOne({
      where: {
        username,
      },
      select: ['username', 'nickname', 'signature', 'avatar', 'userBg'],
    });
    return {
      message: '修改成功',
      data: userInfo,
    };
  }

  /**
   * 用户登录
   * @param {string} 参数对象.username 用户名
   * @param {string} 参数对象.password 密码
   * @param {boolean} 参数对象.remember 是否记住登录状态
   * @returns {Promise} 返回一个Promise对象，包含登录结果
   * @throws {ForbiddenException} 用户被封禁异常
   * @throws {BadRequestException} 参数错误异常
   */
  async login({ username, password, remember }: UserLoginDto) {
    // 验证加密密码
    password = encrypt(password);
    const userInfo = await this.userRepository.findOne({
      where: {
        username,
        password,
      },
    });
    if (userInfo) {
      const userBlockingStatus = await this.banService.userBlockingStatus(
        userInfo.userid,
      );

      if (userBlockingStatus) {
        delete userBlockingStatus.id;
        throw new ForbiddenException(userBlockingStatus);
      }
      return {
        message: '登录成功',
        data: {
          token: this.jwtService.sign(
            { userid: userInfo.userid, username: userInfo.username },
            { expiresIn: remember ? '30d' : '1h' },
          ),
          userInfo: userInfo.userid,
        },
      };
    } else {
      throw new BadRequestException('用户名或密码错误');
    }
  }

  /**
   * 更新用户安全信息
   * @param {string} originalPassword - 原密码
   * @param {string} password - 新密码
   * @returns {Promise<object>} 返回修改结果
   */
  async UpdateSecurity(
    { originalPassword, password }: UpdateSecurityDto,
    { userid },
  ) {
    // 根据原密码查找用户
    const findUser = await this.userRepository.findOne({
      where: { userid, password: encrypt(originalPassword) },
    });
    // 如果找到匹配的用户，则更新密码
    if (findUser) {
      await this.userRepository.update(
        { userid },
        {
          password: encrypt(password),
        },
      );
    } else {
      // 如果找不到匹配的用户，则抛出异常
      throw new BadRequestException('原密码错误');
    }
    // 返回密码修改成功的消息
    return {
      message: '密码修改成功',
    };
  }

  // 通过邮件找回密码
  async sendForgotPasswordMail({ email }: { email: string }) {
    // 查询邮箱是否存在
    const findEmail = await this.userRepository.findOne({
      where: { email },
      select: ['email', 'userid', 'nickname', 'username'],
    });
    if (findEmail) {
      const existingtoken = await this.resetToekn.findOne({
        where: {
          user_id: { userid: findEmail.userid },
          expireTime: MoreThanOrEqual(new Date()),
        },
      });
      const token = [...Array(16)]
        .map(() => {
          const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          return characters.charAt(
            Math.floor(Math.random() * characters.length),
          );
        })
        .join('');
      if (existingtoken) {
        throw new BadRequestException('重置密码邮件已发送，请勿频繁点击');
      } else {
        this.resetToekn.save({
          user_id: { userid: findEmail.userid },
          token: token,
          expireTime: new Date(new Date().getTime() + 5 * 60 * 1000),
        });
      }
      this.mailService.sendForgotPasswordMail(
        `${findEmail.nickname ? findEmail.nickname : findEmail.username}<${email}>`,
        '找回您的密码【佳雯的日记】',
        token,
      );
      return {
        message: '邮件已发送至您的邮箱，请查收',
      };
    } else {
      throw new BadRequestException('邮箱不存在');
    }
  }

  /**
   * 根据重置密码链接查找用户
   * @param {string} token - 重置密码链接
   * @returns {Promise<object>} - 包含用户信息的对象
   * @throws {BadRequestException} - 重置密码链接已过期，请重新获取
   */
  async findForgotPasswordUser({ token }: { token: string }): Promise<object> {
    // 查询重置密码链接
    const findToken = await this.resetToekn
      .createQueryBuilder('resetToken')
      .leftJoin('resetToken.user_id', 'user')
      .select(['resetToken.id', 'resetToken.token', 'user.userid'])
      .where('resetToken.token = :token', { token: token })
      .andWhere('resetToken.expireTime >= :now', { now: new Date() })
      .getOne();

    // 如果找到重置密码链接
    if (findToken) {
      // 查询用户信息
      const findUser = await this.userRepository.findOne({
        where: {
          userid: findToken.user_id.userid,
        },
        select: ['username', 'email', 'userid'],
      });
      return {
        ...findUser,
      };
    } else {
      // 抛出异常，重置密码链接已过期
      throw new BadRequestException('重置密码链接已过期，请重新获取');
    }
  }

  async resetPasswordFromEmail({ resetPassword, token }) {
    const checkToken = await this.resetToekn
      .createQueryBuilder('resetToken')
      .leftJoin('resetToken.user_id', 'user')
      .select([
        'resetToken.id',
        'resetToken.token',
        'user.userid',
        'resetToken.used',
      ])
      .where('resetToken.token = :token', { token: token })
      .andWhere('resetToken.expireTime >= :now', { now: new Date() })
      .getOne();
    if (checkToken) {
      if (!checkToken.used) {
        await this.resetToekn.update(
          { id: checkToken.id },
          {
            used: true,
          },
        );
        await this.userRepository.update(
          { userid: checkToken.user_id.userid },
          {
            password: encrypt(resetPassword.password),
          },
        );
        return {
          message: '密码修改成功',
        };
      } else {
        throw new BadRequestException('该链接已被使用，请重新获取');
      }
    } else {
      throw new BadRequestException('重置密码链接已过期，请重新获取');
    }
  }
}
