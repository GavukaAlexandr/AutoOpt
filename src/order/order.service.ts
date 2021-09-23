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

  async getLastOrder(user) {
    return this.prisma.order.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 1,
      include: { model: { include: { brand: true, type: true } } },
    });
  }

  async getOrders(user) {
    return this.prisma.order.findMany({
      where: { userId: user.id },
      include: { model: { include: { brand: true, type: true } } },
    });
  }
}
