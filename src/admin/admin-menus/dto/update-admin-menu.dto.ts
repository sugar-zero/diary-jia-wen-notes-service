import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminMenuDto } from './create-admin-menu.dto';

export class UpdateAdminMenuDto extends PartialType(CreateAdminMenuDto) {}
