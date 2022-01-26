import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from '../user/user.decorator';
import { CreateOrder } from './dto/create.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() order: CreateOrder, @User() user) {
    return this.orderService.create(order, user);
  }

  @Get('last')
  async getOrder(@User() user) {
    return this.orderService.getLastOrder(user);
  }

  @Get('all')
  async getOrders(@User() user) {
    return this.orderService.getOrders(user);
  }
}
