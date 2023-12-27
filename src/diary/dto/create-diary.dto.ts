import { IsString, IsOptional, IsArray } from 'class-validator';
import { NotEmpty } from '../../validators/NotEmptyValidator';

export class CreateDiaryDto {
  //日记文本和文件两个值其中一个不为空
  @IsOptional()
  @IsArray({ message: '日记附件只能是对象组' })
  @NotEmpty()
  files?: Array<object>;

  @IsOptional()
  @IsString({ message: '日记形式只能是文本' })
  @NotEmpty()
  content?: string;
}
