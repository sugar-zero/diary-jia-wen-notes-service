import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsDate,
  IsEmpty,
} from 'class-validator';

export class CreateSubscribeDto {
  @IsString()
  @IsNotEmpty()
  endpoint: string;

  expirationTime: Date | null;

  @IsObject()
  keys: object;
}
