import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RegisterDto } from './dto/register-dto';
import { UserLoginDto } from './dto/userlogin-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SystemService } from 'src/system/system.service';
import { BanService } from 'src/block/block.service';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { encrypt } from '../utils/aes';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly systemService: SystemService,
    private readonly banService: BanService,
    private readonly jwtService: JwtService,
  ) {}
  async register({ username, password, email, nickname }: RegisterDto) {
    //判断是否开启注册
    // const allowRegister = await this.systemConfigRepository.findOne({
    //   where: {
    //     allowResgister: true,
    //   },
    // });
    // if (!allowRegister) {
    //   throw new BadRequestException('注册已关闭');
    // }
    const allowResgister = await this.systemService.GetInfo();
    if (!allowResgister.data.allowResgister)
      throw new BadRequestException('注册已关闭');
    //查找用户是否存在
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
    if (user) {
      throw new BadRequestException('用户已注册');
    }
    //加密密码
    password = encrypt(password);
    // console.log(password.length);
    nickname = !nickname
      ? 'JW_' + Math.random().toString(30).slice(-8)
      : nickname; //昵称为空随机生成昵称
    const newUser = await this.userRepository.save({
      username,
      password,
      email,
      nickname,
    });

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

  findAll() {
    return `This action returns all user`;
  }
  //获取用户信息
  async GetUserInfo({ username }) {
    const userInfo = await this.userRepository.findOne({
      where: {
        username,
      },
      select: ['username', 'nickname', 'signature', 'avatar', 'userBg'],
    });
    return {
      data: userInfo,
    };
  }
  //更新用户信息
  async UpdateUserInfo({ nickname, signature, avatar, userBg }, { username }) {
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

  //登录
  async login({ username, password, remember }: UserLoginDto) {
    //验证加密密码
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
}
