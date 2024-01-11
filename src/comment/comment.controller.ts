import { Controller, Post, Body, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';

@Controller({
  path: 'diary/comment',
  version: '1',
})
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createComment(createCommentDto);
  }

  @Delete()
  remove(@Body() deleteCommentDto: DeleteCommentDto) {
    return this.commentService.removeComment(deleteCommentDto);
  }
}
