import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDiaryDto } from './create-admin-diary.dto';

export class UpdateAdminDiaryDto extends PartialType(CreateAdminDiaryDto) {}
