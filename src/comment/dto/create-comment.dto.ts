import { IsInt, IsNotEmpty } from 'class-validator';
import { IsStringOrObject } from '../../validators/stringOrObjectValidator';

export class CreateCommentDto {
  @IsStringOrObject()
  @IsNotEmpty({ message: '评论不能为空' })
  comment: string | object;

  @IsInt()
  @IsNotEmpty()
  diaryId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}
