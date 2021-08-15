import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(order, user: User) {
    const { userId, modelId, ...preparedOrder } = order;
    return this.prisma.order.create({
      data: {
        ...preparedOrder,
        user: { connect: { id: user.id } },
        model: { connect: { id: order.modelId } },
      },
      include: { user: true, model: { include: { brand: true, type: true } } },
    });
  }
}
