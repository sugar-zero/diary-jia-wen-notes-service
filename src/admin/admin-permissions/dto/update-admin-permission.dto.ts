import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminPermissionDto } from './create-admin-permission.dto';

export class UpdateAdminPermissionDto extends PartialType(CreateAdminPermissionDto) {}
