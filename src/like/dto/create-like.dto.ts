import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateLikeDto {
  @IsInt()
  @IsNotEmpty()
  diaryId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}
