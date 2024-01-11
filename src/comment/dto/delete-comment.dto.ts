import { IsInt, IsNotEmpty } from 'class-validator';

export class DeleteCommentDto {
  @IsInt()
  @IsNotEmpty()
  commentId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}
