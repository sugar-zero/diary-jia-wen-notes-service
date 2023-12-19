import { Controller, Get } from '@nestjs/common';
import { SystemService } from './system.service';

@Controller({
  path: 'system',
  version: '1',
})
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('config')
  Getinfo() {
    return this.systemService.GetInfo();
  }
}
