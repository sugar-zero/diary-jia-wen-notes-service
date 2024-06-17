import { IsString, IsNotEmpty, IsArray, IsInt } from 'class-validator';

export class AdminRoleCreateDto {
  @IsString({ message: '角色名必须是字符串' })
  @IsNotEmpty({ message: '角色名不能为空' })
  label: string;

  @IsArray({ message: '权限必须是数组' })
  permissions: number[];

  @IsInt({ message: '权限等级必须为数字' })
  @IsNotEmpty({ message: '权限等级不能为空' })
  soft: number;
}
