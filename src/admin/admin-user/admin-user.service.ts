import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AdminUserLoginDto } from './dto/admin-user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BanService } from 'src/block/block.service';
import { encrypt } from 'src/utils/aes';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly banService: BanService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 执行用户登录操作。
   * @param {AdminUserLoginDto} { username, password } - 包含用户名和密码的对象。
   * @returns {Promise<object>} 登录成功返回包含token和userInfo的对象，否则抛出异常。
   * @throws {BadRequestException} 如果用户名或密码错误。
   * @throws {ForbiddenException} 如果用户被禁用。
   */
  async login({ username, password }: AdminUserLoginDto): Promise<{
    message: string;
    data: {
      token: string;
      userInfo: number;
    };
  }> {
    // 对密码进行加密处理
    password = encrypt(password);
    // 在数据库中查找对应的用户名和密码
    const userInfo = await this.userRepository.findOne({
      where: {
        username,
        password,
      },
    });
    if (userInfo) {
      /**
       * 检查当前用户是否被禁用。
       * 为了保险起见，忽略1号用户的封禁状态。
       * 如果用户被禁用，会删除用户的id字段，并抛出ForbiddenException异常。
       */
      if (userInfo.userid !== 1) {
        // 检查用户是否被禁用
        const userBlockingStatus = await this.banService.userBlockingStatus(
          userInfo.userid,
        );

        if (userBlockingStatus) {
          // 如果用户被禁用，删除id字段并抛出ForbiddenException
          delete userBlockingStatus.id;
          throw new ForbiddenException(userBlockingStatus);
        }
      }
      // 登录成功，返回成功信息和token
      return {
        message: '登录成功',
        data: {
          token: this.jwtService.sign(
            { userid: userInfo.userid, username: userInfo.username },
            { expiresIn: '1h' },
          ),
          userInfo: userInfo.userid,
        },
      };
    } else {
      // 如果未找到用户，抛出BadRequestException
      throw new BadRequestException('用户名或密码错误');
    }
  }

  async admin_user_info() {
    return {
      avatar: 'https://dummyimage.com/234x60',
      permissions: [{ label: '仪表盘', value: 'dashboard_console' }],
    };
  }
}
