import { Resolver, Query, Args, Int, Mutation, Parent, ResolveField, ID } from '@nestjs/graphql';
import { Public } from 'src/auth/decorators';
import { ListMetadata } from 'src/list.metaData';
import { PrismaService } from 'src/prisma.service';
import { Model } from 'src/transport/gql/model.model';
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
  @ResolveField('user', () => User)
  async user(@Parent() order: Order) {
    const { userId } = order;
    return this.prismaService.user.findUnique({ where: { id: userId } });
  }


  @Public()
  @ResolveField('model', () => Model)
  async model(@Parent() order: Order) {
    const { modelId } = order;
    return this.prismaService.model.findUnique({
      where: {
        id: modelId
      },
      include: { type: true }
    })
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
    });
  }

  @Public()
  @Query(() => ListMetadata)
  async allOrdersMeta(
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
  async updateOrder(
    @Args({ name: 'id', type: () => ID }) id,
    @Args({ name: 'updateOrderInput', type: () => UpdateOrderInput, nullable: true }) updateOrderInput,
  ) {
    return this.prismaService.order.update({
      where: { id },
      data: {
        ...updateOrderInput
      },
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
