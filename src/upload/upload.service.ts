import { Injectable } from '@nestjs/common';
import { UploadUploadDto } from './dto/create-upload.dto';

@Injectable()
export class UploadService {
  upload(UploadUploadDto: UploadUploadDto) {
    return 'This action adds a new upload';
  }
}
