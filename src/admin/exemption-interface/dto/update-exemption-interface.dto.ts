import { PartialType } from '@nestjs/mapped-types';
import { CreateExemptionInterfaceDto } from './create-exemption-interface.dto';

export class UpdateExemptionInterfaceDto extends PartialType(CreateExemptionInterfaceDto) {}
