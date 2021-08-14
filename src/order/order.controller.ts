import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from 'src/user/dto/CreateUserDto';
import { User } from 'src/user/user.decorator';
import { CreateOrder } from './dto/create.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() order: CreateOrder, @User() user) {
    return this.orderService.create(order);
  }
}
