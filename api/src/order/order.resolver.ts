// import { RemoveOrderInput, CreateOrderInput } from './../graphql';
import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { Public } from 'src/auth/decorators';
import { UpdateOrderInput } from 'src/graphql';
import { PrismaService } from 'src/prisma.service';

@Resolver('Order')
export class OrderResolver {
  constructor(private prismaService: PrismaService) {}

  @Public()
  @Query('gerOrder')
  async order(@Args('id') id: string) {
    return this.prismaService.order.findMany({
      where: { id: id, isDeleted: false },
    });
  }

  @Public()
  @Query('allOrders')
  async orders(
    @Args('perPage', { type: () => Int, nullable: true }) perPage,
    @Args('page', { type: () => Int, nullable: true }) page,
    @Args('sortField', { type: () => String, nullable: true }) sortField,
    @Args('sortOrder', { type: () => String, nullable: true }) sortOrder,
    @Args('filter', { type: () => String, nullable: true }) filter,
  ) {
    return this.prismaService.order.findMany({
      skip: page,
      take: perPage,
      orderBy: { [sortField]: sortOrder },
    });
  }

  @Public()
  @Mutation('createOrder')
  async createOrder(@Args('createOrderInput') createOrderInput) {
    const { modelId, userId, ...preparedOrder } = createOrderInput;
    return this.prismaService.order.create({
      data: {
        ...preparedOrder,
        user: { connect: { id: userId } },
        model: { connect: { id: modelId } },
      },
      include: { user: true, model: { include: { brand: true, type: true } } },
    });
  }

  @Public()
  @Mutation('updateOrder')
  async updateOrder(
    @Args('updateOrderInput') updateOrderInput: UpdateOrderInput,
  ) {
    console.log(updateOrderInput);
    const { id, ...preparedOrder } = updateOrderInput;
    return this.prismaService.order.update({
      where: { id: id },
      data: { ...preparedOrder },
    });
  }

  @Public()
  @Mutation('deleteOrder')
  async removeOrder(
    @Args('id') id: string,
) {
    return this.prismaService.order.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  }
}
