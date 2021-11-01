import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { createModelDto } from './dto/transport.dto';

@Injectable()
export class TransportService {
  constructor(private readonly prisma: PrismaService) {}

  async getTransportType() {
    return this.prisma.type.findMany();
  }

  async getBrands(transportId: string) {
    return this.prisma.model.findMany({
      where: { 
        typeId: transportId
      },
      select: {
        brand: true
      }
    });
  }

  async getModels(transportId: string, brandId: string) {
    return this.prisma.model.findMany({
      where: {
        brandId: brandId,
        typeId: transportId,
      },
    });
  }

  async createBrand(name: string ) {
    return this.prisma.brand.create({
      data: {
        name: name,
      },
    });
  }

  async createModel({ name, brand, type }: createModelDto) {
    return this.prisma.model.create({
      data: {
        name: name,
        brand: { connect: { name: brand } },
        type: { connect: { name: type } },
      },
    });
  }
}
