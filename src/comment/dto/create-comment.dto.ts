import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: '评论必须为字符串' })
  @IsNotEmpty({ message: '评论不能为空' })
  comment: string;

  @IsInt()
  @IsNotEmpty()
  diaryId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}
