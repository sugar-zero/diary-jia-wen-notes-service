import { Controller, Post, Body, Delete } from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';

@Controller({
  path: 'diary/like',
  version: '1',
})
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likeService.like(createLikeDto);
  }

  @Delete()
  remove(@Body() createLikeDto: CreateLikeDto) {
    return this.likeService.cancelLike(createLikeDto);
  }
}
