import { PartialType } from '@nestjs/mapped-types';
import { CreateBanDto } from './create-block.dto';

export class UpdateBanDto extends PartialType(CreateBanDto) {}
