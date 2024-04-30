import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  username: string;

  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  // @Length(6, 6, { message: '密码长度不能小于6位' })
  password: string;

  @IsBoolean()
  @IsOptional()
  remember?: boolean;
}
