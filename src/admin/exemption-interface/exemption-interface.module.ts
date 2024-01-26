import { Module } from '@nestjs/common';
import { ExemptionInterfaceService } from './exemption-interface.service';
import { ExemptionInterfaceController } from './exemption-interface.controller';
import { ExemptionInterface } from './entities/exemption-interface.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ExemptionInterface])],
  controllers: [ExemptionInterfaceController],
  providers: [ExemptionInterfaceService],
  exports: [ExemptionInterfaceService],
})
export class ExemptionInterfaceModule {}
