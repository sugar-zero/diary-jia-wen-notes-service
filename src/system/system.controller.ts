import { Controller, Get } from '@nestjs/common';
import { SystemService } from './system.service';
import { CacheService } from 'src/admin/cache/cache.service';

@Controller({
  path: 'system',
  version: '1',
})
export class SystemController {
  constructor(
    private readonly systemService: SystemService,
    private readonly cacheService: CacheService,
  ) {}

  @Get('config')
  Getinfo() {
    return this.cacheService.getCache('system');
  }
}
