import { Order } from '.prisma/client';
import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { Public } from 'src/auth/decorators';
// import { Order, OrderInput, UpdateOrderInput } from 'src/graphql';
import { PrismaService } from 'src/prisma.service';

@Resolver('Order')
export class OrderResolver {
  constructor(private prismaService: PrismaService) {}

  @Public()
  @Query('order')
  async order(@Args('id') id: string) {
    return this.prismaService.order.findUnique({ where: { id: id } });
  }

  // @Public()
  // @Mutation('createOrder')
  // async createOrder(@Args('orderInput') orderInput: Order) {
  //   this.prismaService.order.create({
  //     data: {
  //       transmission: orderInput.transmission,
  //       bodyType: orderInput.bodyType,
  //       drive: orderInput.drive,
  //       year: orderInput.year,
  //       engineVolume: orderInput.engineVolume,
  //       vin: orderInput.vin,
  //       fuel: orderInput.fuel,
  //       part: orderInput.part,
  //       carPart: orderInput.carPart,
  //       user: { connect: { id: orderInput.userId } },
  //       model: { connect: { id: orderInput.modelId } },
  //     },
  //     include: { user: true, model: { include: { brand: true, type: true } } },
  //   });
  // }

  @Public()
  @Mutation('updateOrder')
  async updateOrder(@Args('updateOrderInput') updateOrderInput) {
    console.log(updateOrderInput);
    const { id, ...preparedOrder } = updateOrderInput;
    this.prismaService.order.update({
      where: { id: id },
      data: { ...preparedOrder },
    });
  }

  @Public()
  @Query('orders')
  async orders(
    @Args('perPage', { nullable: true, type: () => Int }) take,
    @Args('page', { type: () => Int, nullable: true }) skip,
    @Args('sortField') sortField,
    @Args('sortOrder', { type: () => String }) sortOrder,
  ) {
    return this.prismaService.order.findMany({
      take,
      skip,
      orderBy: {
        id: sortOrder,
      },
    });
  }
}
