import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminSubscribeDto } from './create-admin-subscribe.dto';

export class UpdateAdminSubscribeDto extends PartialType(CreateAdminSubscribeDto) {}
