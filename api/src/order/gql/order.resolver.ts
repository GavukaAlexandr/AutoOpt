import { Resolver, Query, Args, Int, Mutation, Parent, ResolveField, ID } from '@nestjs/graphql';
import { Public } from 'src/auth/decorators';
import { ListMetadata } from 'src/list.metaData';
import { PrismaService } from 'src/prisma.service';
import { User } from 'src/user/gql/user.model';
import { CreateOrderInput, DeleteOrderInput, Order, OrderFilter, UpdateOrderInput } from './order.model';

@Resolver(of => Order)
export class OrderResolver {
  constructor(private prismaService: PrismaService) { }

  @Public()
  @Query(returns => Order)
  async Order(@Args('id', { type: () => ID, nullable: true }) id: string) {
    return this.prismaService.order.findUnique({
      where: { id: id },
    });
  }

  @Public()
  @ResolveField('orders', returns => [User])
  async user(@Parent() user: Order) {
    const { id } = user;
    return this.prismaService.user.findMany({ where: { id } });
  }

  @Public()
  @Query(() => [Order])
  async allOrders(
    @Args('perPage', { type: () => Int, nullable: true }) perPage,
    @Args('page', { type: () => Int, nullable: true }) page,
    @Args('sortField', { type: () => String, nullable: true }) sortField,
    @Args('sortOrder', { type: () => String, nullable: true }) sortOrder,
    @Args('filter', { type: () => OrderFilter, nullable: true }) filter: OrderFilter,
  ) {
    return this.prismaService.order.findMany({
      skip: page,
      take: perPage,
      orderBy: { [sortField]: sortOrder },
      where: {
        id: { in: filter.ids },
      }
    });
  }

  @Public()
  @Query(() => ListMetadata)
  async _allOrdersMeta(
    @Args('perPage', { type: () => Int, nullable: true }) perPage,
    @Args('page', { type: () => Int, nullable: true }) page,
    @Args('sortField', { type: () => String, nullable: true }) sortField: string,
    @Args('sortOrder', { type: () => String, nullable: true }) sortOrder: string,
    @Args('filter', { type: () => OrderFilter, nullable: true }) filter,
  ) {
    const count = await this.prismaService.order.count(({
      orderBy: { [sortField]: sortOrder },
      where: {
        id: { in: filter.ids },
      }
    }));
    return { count: count };
  };

  @Public()
  @Mutation(() => Order)
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
  @Mutation(returns => Order)
  async deleteOrder(@Args({ name: 'id', type: () => ID }) id) {
    return this.prismaService.order.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  }
}
