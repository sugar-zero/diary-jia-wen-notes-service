import { IsString, IsNotEmpty, Length } from 'class-validator';
export class UpdateSecurityDto {
  @IsString({ message: '原密码必须是字符串' })
  @IsNotEmpty({ message: '原密码不能为空' })
  @Length(6, 50, { message: '原密码长度不能小于6位' })
  originalPassword: string;

  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 50, { message: '密码长度不能小于6位' })
  password: string;
}
