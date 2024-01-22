import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { JwtDecrypTool } from '../utils/aes';

@Controller({
  path: 'subscribe',
  version: '1',
})
export class SubscribeController {
  constructor(
    private readonly subscribeService: SubscribeService,
    private readonly jwtDecrypTool: JwtDecrypTool,
  ) {}

  @Post()
  create(@Body() createSubscribeDto: CreateSubscribeDto, @Headers() header) {
    return this.subscribeService.createSubscribe(
      createSubscribeDto,
      this.jwtDecrypTool.getDecryp(header.authorization),
    );
  }
  @Post('admin-push')
  PushAnnouncement(@Body() body, @Headers() header) {
    // 暂时写死判断只有1号用户为管理员，后续再更新支持角色配置
    const isAdmin =
      this.jwtDecrypTool.getDecryp(header.authorization).userid === 1;
    if (isAdmin) {
      return this.subscribeService.administratorPush(body);
    } else {
      throw new UnauthorizedException('非法请求');
    }
  }

  @Post('admin-push-all')
  PushAllUserAnnouncement(@Body() body, @Headers() header) {
    // 暂时写死判断只有1号用户为管理员，后续再更新支持角色配置
    const isAdmin =
      this.jwtDecrypTool.getDecryp(header.authorization).userid === 1;
    if (isAdmin) {
      return this.subscribeService.administratorPushAll(body);
    } else {
      throw new UnauthorizedException('非法请求');
    }
  }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.subscribeService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateSubscribeDto: UpdateSubscribeDto,
  // ) {
  //   return this.subscribeService.update(+id, updateSubscribeDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.subscribeService.remove(+id);
  // }
}
