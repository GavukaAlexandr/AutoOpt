import { BodyType } from '.prisma/client';
import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { Public } from 'src/auth/decorators';
import { PrismaService } from 'src/prisma.service';
import { CreateOrderInput, DeleteOrderInput, ListMetadata, Order, OrderFilter, UpdateOrderInput } from './order.model';

@Resolver(of => Order)
export class OrderResolver {
  constructor(private prismaService: PrismaService) { }

  @Public()
  @Query(returns => Order)
  async getOrder(@Args('id') id: string) {
    return this.prismaService.order.findMany({
      where: { id: id, isDeleted: false },
    });
  }

  @Public()
  @Query(returns => [Order])
  async allOrders(
    @Args('perPage', { type: () => Int, nullable: true }) perPage,
    @Args('page', { type: () => Int, nullable: true }) page,
    @Args('sortField', { type: () => String, nullable: true }) sortField,
    @Args('sortOrder', { type: () => String, nullable: true }) sortOrder,
    @Args('filter', { type: () => OrderFilter, nullable: true }) filter,
  ) {
    return this.prismaService.order.findMany({
      skip: page,
      take: perPage,
      orderBy: { [sortField] : sortOrder},
      where: {
        id: {
          in: filter
        }
      }
    });
  }

  @Public()
  @Query(returns => ListMetadata)
  async _allOrdersMeta(
    @Args('perPage', { type: () => Int, nullable: true }) perPage,
    @Args('page', { type: () => Int, nullable: true }) page,
    @Args('sortField', { type: () => String, nullable: true }) sortField: string,
    @Args('sortOrder', { type: () => String, nullable: true }) sortOrder: string,
    @Args('filter', { type: () => OrderFilter, nullable: true }) filter,
  ) {
    const count = await this.prismaService.order.count(({
      skip: page,
      take: perPage,
      orderBy: { [sortField]: sortOrder},
    }));
    return {count: count };
  }

  @Public()
  @Mutation(returns => Order)
  async createOrder(@Args({ name: 'createOrderInput', type: () => CreateOrderInput }) createOrderInput) {
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
  @Mutation(returns => Order)
  async updateOrder(@Args({ name: 'updateOrderInput', type: () => UpdateOrderInput }) updateOrderInput) {
    const { id, ...preparedOrder } = updateOrderInput;
    return this.prismaService.order.update({
      where: { id: id },
      data: { ...preparedOrder },
    });
  }

  @Public()
  @Mutation(returns => Boolean)
  async deleteOrder(@Args({ name: 'deleteOrderInput', type: () => DeleteOrderInput }) deleteOrderInput) {
    return this.prismaService.order.update({
      where: { id: deleteOrderInput.id },
      data: {
        isDeleted: true,
      },
    });
  }

  @Public()
  @Query(() => BodyType)
  async bodyType() {
    return 
  }
}
