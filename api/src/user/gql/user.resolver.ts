import { Resolver, Query, Args, Int, Mutation, ResolveField, Parent } from '@nestjs/graphql';
import { Public } from 'src/auth/decorators';
import { ListMetadata } from 'src/list.metaData';
import { Order } from 'src/order/gql/order.model';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserInput, User, UserFilter } from './user.model';

@Resolver(of => User)
export class UserResolver {
  constructor(private prismaService: PrismaService) { }

  @Public()
  @Query(returns => User)
  async User(@Args('id') id: string) {
    return this.prismaService.user.findUnique({
      where: { id: id },
    });
  }

  @Public()
  @ResolveField('orders', returns => [Order])
  async order(@Parent() user: User) {
    const { id } = user;
    return this.prismaService.order.findMany({ where: { userId: id } });
  }

  @Public()
  @Query(returns => [User])
  async allUsers(
    @Args('perPage', { type: () => Int, nullable: true }) perPage,
    @Args('page', { type: () => Int, nullable: true }) page,
    @Args('sortField', { type: () => String, nullable: true }) sortField,
    @Args('sortOrder', { type: () => String, nullable: true }) sortOrder,
    @Args('filter', { type: () => UserFilter, nullable: true }) filter: UserFilter,
  ) {
    return this.prismaService.user.findMany({
      skip: page,
      take: perPage,
      orderBy: { [sortField]: sortOrder },
      where: {
        id: { in: filter.ids },
      }
    });
  }

  @Public()
  @Query(returns => ListMetadata)
  async _allUsersMeta(
    @Args('perPage', { type: () => Int, nullable: true }) perPage,
    @Args('page', { type: () => Int, nullable: true }) page,
    @Args('sortField', { type: () => String, nullable: true }) sortField: string,
    @Args('sortOrder', { type: () => String, nullable: true }) sortOrder: string,
    @Args('filter', { type: () => UserFilter, nullable: true }) filter: UserFilter,
  ) {
    const count = await this.prismaService.user.count(({
      orderBy: { [sortField]: sortOrder },
      where: {
        id: { in: filter.ids },
      }
    }));
    return { count: count };
  }

  @Public()
  @Mutation(() => User)
  async updateUser(@Args({ name: 'updateUserInput', type: () => UpdateUserInput, nullable: true }) updateUserInput) {
    const { id, ...preparedUser } = updateUserInput;

    return this.prismaService.user.update({
      where: { id: id },
      data: { ...preparedUser }
    })
  }


}

//   @Public()
//   @Mutation(returns => Order)
//   async createOrder(@Args({ name: 'createOrderInput', type: () => CreateOrderInput }) createOrderInput) {
//     const { modelId, userId, ...preparedOrder } = createOrderInput;
//     return this.prismaService.order.create({
//       data: {
//         ...preparedOrder,
//         user: { connect: { id: userId } },
//         model: { connect: { id: modelId } },
//       },
//       include: { user: true, model: { include: { brand: true, type: true } } },
//     });
//   }

//   @Public()
//   @Mutation(returns => Order)
//   async updateOrder(@Args({ name: 'updateOrderInput', type: () => UpdateOrderInput }) updateOrderInput) {
//     const { id, ...preparedOrder } = updateOrderInput;
//     return this.prismaService.order.update({
//       where: { id: id },
//       data: { ...preparedOrder },
//     });
//   }

//   @Public()
//   @Mutation(returns => Order)
//   async deleteOrder(@Args({ name: 'deleteOrderInput', type: () => DeleteOrderInput }) deleteOrderInput) {
//     return this.prismaService.order.update({
//       where: { id: deleteOrderInput.id },
//       data: {
//         isDeleted: true,
//       },
//     });
//   }
// }