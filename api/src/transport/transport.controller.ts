import {
  BodyType,
  DriveType,
  FuelType,
  PartType,
  Transmission,
} from '@prisma/client';
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

  @Get('models/:transportId/:brandId')
  async getModels(
    @Param('transportId') transportId: string,
    @Param('brandId') brandId: string,
  ) {
    return this.transportService.getModels(transportId, brandId);
  }

  @Post('brand')
  async createBrand(@Body() brand: string) {
    return this.transportService.createBrand(brand);
  }

  @Post('model')
  async createModel(@Body() model: createModelDto) {
    return this.transportService.createModel(model);
  }

  @Get('body-types')
  async getBodyTypes() {
    return Object.values(BodyType);
  }

  @Get('drive-types')
  async getDriveTypes() {
    return Object.values(DriveType);
  }

  @Get('transmission-types')
  async getTransmissionTypes() {
    return Object.values(Transmission);
  }

  @Get('part-types')
  async getPartTypes() {
    return Object.values(PartType);
  }

  @Get('fuel-types')
  async getFuelTypes() {
    return Object.values(FuelType);
  }
}
