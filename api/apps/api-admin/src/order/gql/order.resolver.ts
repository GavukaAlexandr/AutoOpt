import { Resolver, Query, Args, Int, Mutation, ID } from '@nestjs/graphql';
import { ListMetadata } from '../../list.metaData';
import { CreateOrderInput, Order, OrderFilter, UpdateOrderInput } from './order.model';
import { startOfDay, endOfDay } from 'date-fns'
import { plainToClass } from 'class-transformer';
import { PrismaService } from 'libs/db/src/prisma.service';
import { Public } from '../../auth/decorators';

@Resolver(of => Order)
export class OrderResolver {
  constructor(private prismaService: PrismaService) { }

  @Public()
  @Query(returns => Order)
  async Order(@Args('id', { type: () => ID, nullable: true }) id: string) {
    const order = await this.prismaService.order.findUnique({
      where: { id: id },
      include: {
        model: { include: { type: true, brand: true } },
        user: true,
        status: true,
        fuels: { select: { fuel: true } },
        bodyType: true,
        transmission: true,
        partOfType: true,
        drive: true,
      },
    });
    const result = order.fuels.map((v) => v.fuel);
    return plainToClass(Order, { ...order, fuels: result });
  }

  //   @Public()
  //   @ResolveField('model', () => Model)
  //   async model(@Parent() order: Order) {
  //     const { modelId } = order;
  //     return this.prismaService.model.findUnique({
  //       where: {
  //         id: modelId
  //       },
  //       include: { type: true }
  //     })
  //   }

  @Public()
  @Query(() => [Order])
  async allOrders(
    @Args('perPage', { type: () => Int, nullable: true }) perPage,
    @Args('page', { type: () => Int, nullable: true }) page,
    @Args('sortField', { type: () => String, nullable: true }) sortField,
    @Args('sortOrder', { type: () => String, nullable: true }) sortOrder,
    @Args('filter', { type: () => OrderFilter, nullable: true }) filter: OrderFilter,
  ) {
    const { endDate, startDate, status, firstName, carPart, lastName, phoneNumber, user } = filter;

    const result = await this.prismaService.order.findMany({
      skip: page,
      take: perPage,
      orderBy: { [sortField]: sortOrder },
      where: {
        userId: user,
        user: {
          firstName: { contains: firstName, mode: 'insensitive' },
          lastName: { contains: lastName, mode: 'insensitive' },
          phoneNumber: { contains: phoneNumber, mode: 'insensitive' },
        },
        status: { id: status },
        createdAt: this.getRangeByDate({ startDate, endDate }),
        carPart: { contains: carPart, mode: 'insensitive' },
      },
      include: { model: { include: { type: true, brand: true } }, user: true, status: true, fuels: true },
      distinct: ["orderNumber"]
    });
    return result;
  }

  @Public()
  @Query(() => [Order])
  async getFirstOrder(
    @Args('sortField', { type: () => String, nullable: true }) sortField: string,
    @Args('sortOrder', { type: () => String, nullable: true }) sortOrder: string,
  ) {
    return this.prismaService.order.findMany(({
      orderBy: { [sortField]: sortOrder },
      take: 1
    }));
  };

  @Public()
  @Query(() => ListMetadata)
  async allOrdersMeta(
    @Args('sortField', { type: () => String, nullable: true }) sortField: string,
    @Args('sortOrder', { type: () => String, nullable: true }) sortOrder: string,
    @Args('filter', { type: () => OrderFilter, nullable: true }) filter: OrderFilter,
  ) {
    const { endDate, startDate, status, user, firstName, lastName, carPart, phoneNumber } = filter;

    const result = await this.prismaService.order.count(({
      orderBy: { [sortField]: sortOrder },
      where: {
        userId: user,
        user: {
          firstName: { contains: firstName, mode: 'insensitive' },
          lastName: { contains: lastName, mode: 'insensitive' },
          phoneNumber: { contains: phoneNumber, mode: 'insensitive' },
        },
        createdAt: this.getRangeByDate({ startDate, endDate }),
        status: { id: status },
        carPart: { contains: carPart, mode: 'insensitive' },
      }
    }));
    return { count: result };
  };

  getRangeByDate({ startDate, endDate }) {
    return (startDate && endDate) && {
      lte: endOfDay(endDate),
      gte: startOfDay(startDate)
    };
  }

  @Public()
  @Mutation(() => Order)
  async createOrder(@Args({ name: 'createOrderInput', type: () => CreateOrderInput }) createOrderInput) {
    const { userId, userCarParamId, modelId, fuelId, transmissionId, bodyTypeId, driveTypeId, partTypeId, status: statusId, ...preparedOrder } = createOrderInput;
    const status = await this.prismaService.orderStatus.findFirst({
      where: { default: true }
    })
    return this.prismaService.order.create({
      data: {
        userCarParamId: userCarParamId,
        user: { connect: { id: userId } },
        status: statusId ? { connect: { id: statusId } } : { connect: { id: status.id } },
        fuels: {
          create: fuelId.map(id => ({
            fuelId: id
          }))
        },
        transmission: { connect: { id: transmissionId } },
        bodyType: { connect: { id: bodyTypeId } },
        drive: { connect: { id: driveTypeId } },
        partOfType: { connect: { id: partTypeId } },
        model: { connect: { id: modelId } },
        ...preparedOrder,
      },
      include: { model: { include: { brand: true, type: true } }, user: true, fuels: true, bodyType: true, drive: true, partOfType: true, transmission: true, status: true }
    })
  }
  @Public()
  @Mutation(returns => Order)
  async updateOrder(
    @Args({ name: 'updateOrderInput', type: () => UpdateOrderInput, nullable: true }) updateOrderInput,
  ) {
    const { id, status: statusId } = updateOrderInput;
    return this.prismaService.order.update({
      where: { id },
      data: {
        orderStatusId: statusId,
        ...updateOrderInput
      },
    });
  }
}
