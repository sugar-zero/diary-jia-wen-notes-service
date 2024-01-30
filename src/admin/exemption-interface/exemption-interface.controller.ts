import {
  Controller,
  // Get,
  // Post,
  // Body,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { ExemptionInterfaceService } from './exemption-interface.service';
// import { CreateExemptionInterfaceDto } from './dto/create-exemption-interface.dto';
// import { UpdateExemptionInterfaceDto } from './dto/update-exemption-interface.dto';

@Controller('exemption-interface')
export class ExemptionInterfaceController {
  constructor(
    private readonly exemptionInterfaceService: ExemptionInterfaceService,
  ) {}

  // @Post()
  // create(@Body() createExemptionInterfaceDto: CreateExemptionInterfaceDto) {
  //   return this.exemptionInterfaceService.create(createExemptionInterfaceDto);
  // }

  // @Get()
  // findAll() {
  //   return this.exemptionInterfaceService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.exemptionInterfaceService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateExemptionInterfaceDto: UpdateExemptionInterfaceDto,
  // ) {
  //   return this.exemptionInterfaceService.update(
  //     +id,
  //     updateExemptionInterfaceDto,
  //   );
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.exemptionInterfaceService.remove(+id);
  // }
}
