import {
  Controller,
  Post,
  Body,
  Headers,
  Get,
  Delete,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
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
  findAll(@Headers() header, @Query() page) {
    return this.diaryService.findAll(
      this.jwtDecrypTool.getDecryp(header.authorization),
      page,
    );
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.diaryService.findOne(+id);
  // }

  @Patch('record')
  update(@Body() patchDiaryData: CreateDiaryDto, @Headers() header) {
    return this.diaryService.update(
      patchDiaryData,
      this.jwtDecrypTool.getDecryp(header.authorization),
    );
    // const newFileslist = req.files.map((item: any) => {
    //   return item.url;
    // });
    // console.log(req);
  }

  @Delete('record/:id')
  remove(@Param('id') id: string, @Headers() header) {
    return this.diaryService.remove(
      +id,
      this.jwtDecrypTool.getDecryp(header.authorization),
    );
  }
}
