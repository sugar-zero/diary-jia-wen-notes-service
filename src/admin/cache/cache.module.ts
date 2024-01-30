import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheController } from './cache.controller';
import { SystemModule } from 'src/system/system.module';
import { ExemptionInterfaceModule } from 'src/admin/exemption-interface/exemption-interface.module';

@Global()
@Module({
  imports: [SystemModule, ExemptionInterfaceModule],
  controllers: [CacheController],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
