import { Body, Controller, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Body() order: Prisma.OrderCreateInput) {
    // this.orderService.create(order);
  }
}
