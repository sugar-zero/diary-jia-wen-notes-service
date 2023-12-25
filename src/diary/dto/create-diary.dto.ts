import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDiaryDto {
  @IsString({ message: '日记形式只能是文本类型' })
  @IsNotEmpty({ message: '日记内容不能为空' })
  content: string;
}
