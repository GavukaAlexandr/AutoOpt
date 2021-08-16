import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { createBrandDto, createModelDto } from './dto/transport.dto';
import { TransportService } from './transport.service';

@Controller('transport')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Get()
  async getTransportType() {
    return this.transportService.getTransportType();
  }

  @Get('brands/:transportId')
  async getBrands(@Param('transportId') transportId: string) {
    return this.transportService.getBrands(transportId);
  }

  @Get('models/:transportType/:brandId')
  async getModels(
    @Param('transportType') transportType: string,
    @Param('brandId') brandId: string,
  ) {
    return this.transportService.getModels(transportType, brandId);
  }

  @Post('brand')
  async createBrand(@Body() brand: createBrandDto) {
    return this.transportService.createBrand(brand);
  }

  @Post('model')
  async createModel(@Body() model: createModelDto) {
    return this.transportService.createModel(model);
  }
}
