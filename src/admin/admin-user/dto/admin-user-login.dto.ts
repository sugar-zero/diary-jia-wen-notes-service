import { IsString, IsNotEmpty } from 'class-validator';

export class AdminUserLoginDto {
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  username: string;

  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
