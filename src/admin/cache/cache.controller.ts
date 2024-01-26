import { Body, Controller, Post } from '@nestjs/common';
import { CacheService } from './cache.service';

@Controller({
  path: 'cache',
  version: '1',
})
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Post('refreshCache')
  resetCron(@Body() { type }) {
    return this.cacheService.refreshCache(type);
  }
}
