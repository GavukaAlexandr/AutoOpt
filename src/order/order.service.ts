import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateOrder } from './dto/create.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(order) {
    const { userId, modelId, ...preparedOrder } = order;
    return this.prisma.order.create({
      data: {
        ...preparedOrder,
        user: { connect: { id: order.userId } },
        model: { connect: { id: order.modelId } },
      },
      include: { user: true, model: { include: { brand: true, type: true } } },
    });
  }
}
