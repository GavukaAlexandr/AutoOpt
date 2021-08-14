import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TransportService {
  constructor(private readonly prisma: PrismaService) {}

  async getTransportType() {
    return this.prisma.type.findMany();
  }

  async getBrands(transportType: string) {
    return this.prisma.brand.findMany({
      where: { types: { some: { type: { name: transportType } } } },
    });
  }

  async getModels(transportType: string, brandId: string) {
    return this.prisma.model.findMany({
      where: {
        brandId: brandId,
        typeId: transportType,
      },
    });
  }
}
