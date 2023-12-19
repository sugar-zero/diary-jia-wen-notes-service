import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { UserService } from './user.service';
// import { RegisterDto } from './dto/register-dto';
// import { UserLoginDto } from './dto/userlogin-dto';
import { decrypt } from '../utils/aes';
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
  register(@Body() registerUserDto) {
    const deReq = decrypt(registerUserDto.data);
    return this.userService.register(JSON.parse(deReq));
  }
  // 登录
  @Post('login')
  login(@Body() req) {
    const deReq = decrypt(req.data);
    return this.userService.login(JSON.parse(deReq));
  }
  // 查询所有
  @Get('info')
  GetUserInfo(@Headers() header) {
    return this.userService.GetUserInfo(
      this.jwtDecrypTool.getDecryp(header.authorization),
    );
  }
  // 查询单个
  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: string) {
  //   return this.userService.findOne(+id);
  // }
}
