import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminBlockDto } from './create-admin-block.dto';

export class UpdateAdminBlockDto extends PartialType(CreateAdminBlockDto) {}
