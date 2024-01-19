import { Controller, Post, Body, Headers } from '@nestjs/common';
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
