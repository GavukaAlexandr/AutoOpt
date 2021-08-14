import { Controller, Get, Param } from '@nestjs/common';
import { TransportService } from './transport.service';

@Controller('transport')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Get()
  async getTransportType() {
    return this.transportService.getTransportType();
  }

  @Get('brands/:transportType')
  async getBrands(@Param('transportType') transportType: string) {
    return this.transportService.getBrands(transportType);
  }

  @Get('models/:transportType/:brandId')
  async getModels(
    @Param('transportType') transportType: string,
    @Param('brandId') brandId: string,
  ) {
    return this.transportService.getModels(transportType, brandId);
  }
}
