import { Controller, Post, Body, Headers, Get } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
// import { UpdateDiaryDto } from './dto/update-diary.dto';
import { JwtDecrypTool } from '../utils/aes';

@Controller({
  path: 'diary',
  version: '1',
})
export class DiaryController {
  constructor(
    private readonly diaryService: DiaryService,
    private readonly jwtDecrypTool: JwtDecrypTool,
  ) {}

  @Post('record')
  create(@Body() createDiaryDto: CreateDiaryDto, @Headers() header) {
    return this.diaryService.createDiary(
      createDiaryDto,
      this.jwtDecrypTool.getDecryp(header.authorization),
    );
  }

  @Get('record')
  findAll(@Headers() header) {
    return this.diaryService.findAll(
      this.jwtDecrypTool.getDecryp(header.authorization),
    );
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.diaryService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDiaryDto: UpdateDiaryDto) {
  //   return this.diaryService.update(+id, updateDiaryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.diaryService.remove(+id);
  // }
}
