import { IsString, IsNotEmpty, IsInt, IsArray } from 'class-validator';

export class AdminRoleUpdateDto {
  @IsInt({ message: 'id必须为数字' })
  @IsNotEmpty({ message: 'id不能为空' })
  @IsNotEmpty({ message: 'id不能为空' })
  id: number;

  @IsString({ message: '角色名必须是字符串' })
  @IsNotEmpty({ message: '角色名不能为空' })
  label: string;

  @IsInt({ message: '权限等级必须是数字' })
  @IsNotEmpty({ message: '权限等级不能为空' })
  soft: number;

  @IsArray({ message: '权限必须是数组' })
  permissions: number[];
}
