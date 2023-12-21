import { Controller, Get, Post, Body, Headers, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register-dto';
import { UserLoginDto } from './dto/userlogin-dto';
import { JwtDecrypTool } from '../utils/aes';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtDecrypTool: JwtDecrypTool,
  ) {}
  // 注册
  @Post('reg')
  async register(@Body() registerUserDto: RegisterDto) {
    return await this.userService.register(registerUserDto);
  }
  // 登录
  @Post('login')
  login(@Body() req: UserLoginDto) {
    return this.userService.login(req);
  }
  // 查询自己用户信息
  @Get('info')
  GetUserInfo(@Headers() header) {
    console.log(this.jwtDecrypTool.getDecryp(header.authorization));
    return this.userService.GetUserInfo(
      this.jwtDecrypTool.getDecryp(header.authorization),
    );
  }

  @Put('info')
  UpdateUserInfo(@Body() req, @Headers() header) {
    return this.userService.UpdateUserInfo(
      req,
      this.jwtDecrypTool.getDecryp(header.authorization),
    );
  }
  // 查询单个
  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: string) {
  //   return this.userService.findOne(+id);
  // }
}
