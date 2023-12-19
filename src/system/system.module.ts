import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { SystemConfig } from './entities/system.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SystemConfig])],
  controllers: [SystemController],
  providers: [SystemService],
})
export class SystemModule {}
