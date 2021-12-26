import { Resolver, Query, Args, Int, Mutation, ResolveField, Parent } from '@nestjs/graphql';
import { Public } from '../../auth/decorators';
import { Order } from '../../order/gql/order.model';
import { CreateUserInput, UpdateUserInput, User, UserFilter } from './user.model';
import { ListMetadata } from '../../list.metaData';
import { PrismaService } from '@app/prisma';

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
    const { firstName, lastName, phoneNumber, email } = filter;
    return this.prismaService.user.findMany({
      skip: page,
      take: perPage,
      orderBy: { [sortField]: sortOrder },
      where: {
        firstName: { contains: firstName, mode: 'insensitive' },
        lastName: { contains: lastName, mode: 'insensitive' },
        phoneNumber: { contains: phoneNumber, mode: 'insensitive' },
        email: { contains: email, mode: 'insensitive' }
      }
    });
  }

  @Public()
  @Query(returns => ListMetadata)
  async allUsersMeta(
    @Args('perPage', { type: () => Int, nullable: true }) perPage,
    @Args('page', { type: () => Int, nullable: true }) page,
    @Args('sortField', { type: () => String, nullable: true }) sortField: string,
    @Args('sortOrder', { type: () => String, nullable: true }) sortOrder: string,
    @Args('filter', { type: () => UserFilter, nullable: true }) filter: UserFilter,
  ) {
    const { firstName, lastName, phoneNumber, email } = filter;
    const count = await this.prismaService.user.count(({
      orderBy: { [sortField]: sortOrder },
      where: {
        firstName: { contains: firstName, mode: 'insensitive' },
        lastName: { contains: lastName, mode: 'insensitive' },
        phoneNumber: { contains: phoneNumber, mode: 'insensitive' },
        email: { contains: email, mode: 'insensitive' }
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

  @Public()
  @Mutation(() => User)
  async createUser(@Args({ name: 'createUserInput', type: () => CreateUserInput, nullable: true }) createUserInput) {
    return this.prismaService.user.create({
      data: {
        firstName: createUserInput.firstName,
        lastName: createUserInput.lastName,
        email: createUserInput.email,
        firebaseUid: createUserInput.firebaseUid,
        phoneNumber: createUserInput.phoneNumber,
        telegramNotification: createUserInput.telegramNotification,
        viberNotification: createUserInput.viberNotification,
        phoneNotification: createUserInput.phoneNotification,
      },
    });
  }

}