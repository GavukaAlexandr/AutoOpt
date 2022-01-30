import { Resolver, Query, Args, Int, Mutation, ID } from '@nestjs/graphql';
import { ListMetadata } from '../../list.metaData';
import {
  CreateOrderInput,
  Order,
  OrderFilter,
  UpdateOrderInput,
} from './order.model';
import { startOfDay, endOfDay } from 'date-fns';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '@app/prisma';

@Resolver((of) => Order)
export class OrderResolver {
  constructor(private prismaService: PrismaService) {}

  @Query((returns) => Order)
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

  @Query(() => [Order])
  async allOrders(
    @Args('perPage', { type: () => Int, nullable: true }) perPage,
    @Args('page', { type: () => Int, nullable: true }) page,
    @Args('sortField', { type: () => String, nullable: true }) sortField,
    @Args('sortOrder', { type: () => String, nullable: true }) sortOrder,
    @Args('filter', { type: () => OrderFilter, nullable: true })
    filter: OrderFilter,
  ) {
    const {
      endDate,
      startDate,
      status,
      firstName,
      carPart,
      lastName,
      phoneNumber,
      user,
    } = filter;

    const result = await this.prismaService.order.findMany({
      skip: page,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      where: {
        isHistory: false,
        userId: user ? user : undefined,
        user:
          firstName || lastName || phoneNumber
            ? {
                firstName: firstName
                  ? { contains: firstName, mode: 'insensitive' }
                  : undefined,
                lastName: lastName
                  ? { contains: lastName, mode: 'insensitive' }
                  : undefined,
                phoneNumber: phoneNumber
                  ? { contains: phoneNumber, mode: 'insensitive' }
                  : undefined,
              }
            : undefined,
        status: status ? { id: status } : undefined,
        createdAt:
          startDate && endDate
            ? this.getRangeByDate({ startDate, endDate })
            : undefined,
        carPart: carPart
          ? { contains: carPart, mode: 'insensitive' }
          : undefined,
      },
      include: {
        model: { include: { type: true, brand: true } },
        user: true,
        status: true,
        fuels: true,
      },
    });
    return result;
  }

  @Query(() => [Order])
  async getFirstOrder(
    @Args('sortField', { type: () => String, nullable: true })
    sortField: string,
    @Args('sortOrder', { type: () => String, nullable: true })
    sortOrder: string,
  ) {
    return this.prismaService.order.findMany({
      orderBy: { [sortField]: sortOrder },
      take: 1,
    });
  }

  @Query(() => ListMetadata)
  async allOrdersMeta(
    @Args('sortField', { type: () => String, nullable: true })
    sortField: string,
    @Args('sortOrder', { type: () => String, nullable: true })
    sortOrder: string,
    @Args('filter', { type: () => OrderFilter, nullable: true })
    filter: OrderFilter,
  ) {
    const {
      endDate,
      startDate,
      status,
      user,
      firstName,
      lastName,
      carPart,
      phoneNumber,
    } = filter;

    const result = await this.prismaService.order.count({
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
      },
    });
    return { count: result };
  }

  getRangeByDate({ startDate, endDate }) {
    return (
      startDate &&
      endDate && {
        lte: endOfDay(endDate),
        gte: startOfDay(startDate),
      }
    );
  }

  /*
  When called create order from Admin
  - Firstly we need to get first Order from db and get this createdAt this data need in "createOrder".
  - Secondary we need to get status that have "default in db" this data need in "createOrder".
  - Thirdly we change all order who have orderNumber like from parameters and change their isHistory to true.
    Then we create order with date from the most first order by this orderNumber, this order will have isHistory false by default 
    it's need to get this order in Front-end. 
  */
  @Mutation(() => Order)
  async createOrder(
    @Args({ name: 'createOrderInput', type: () => CreateOrderInput })
    createOrderInput,
  ) {
    const {
      orderNumber,
      userId,
      userCarParamId,
      modelId,
      fuelId,
      transmissionId,
      bodyTypeId,
      driveTypeId,
      partTypeId,
      status: statusId,
      ...preparedOrder
    } = createOrderInput;

    const firstCurrentOrder = await this.prismaService.order.findFirst({
      where: { orderNumber: orderNumber },
      orderBy: { createdAt: 'desc' },
    });

    const status = await this.prismaService.orderStatus.findFirst({
      where: { default: true },
    });

    const allOrdersToHistory = this.prismaService.order.updateMany({
      where: {
        userId,
        orderNumber: orderNumber ?? undefined,
      },
      data: {
        isHistory: true,
      },
    });

    const date = new Date();

    const createOrder = this.prismaService.order.create({
      data: {
        orderNumber: orderNumber,
        userCarParamId: userCarParamId,
        user: { connect: { id: userId } },
        status: statusId
          ? { connect: { id: statusId } }
          : { connect: { id: status.id } },
        fuels: {
          create: fuelId.map((id) => ({
            fuelId: id,
          })),
        },
        transmission: { connect: { id: transmissionId } },
        bodyType: { connect: { id: bodyTypeId } },
        drive: { connect: { id: driveTypeId } },
        partOfType: { connect: { id: partTypeId } },
        model: { connect: { id: modelId } },
        createdAt: firstCurrentOrder.createdAt,
        updatedAt: new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds(),
          ),
        ),
        ...preparedOrder,
      },
      include: {
        model: { include: { brand: true, type: true } },
        user: true,
        fuels: true,
        bodyType: true,
        drive: true,
        partOfType: true,
        transmission: true,
        status: true,
      },
    });

    const [, result] = await this.prismaService.$transaction([
      allOrdersToHistory,
      createOrder,
    ]);
    return result;
  }

  @Mutation((returns) => Order)
  async updateOrder(
    @Args({
      name: 'updateOrderInput',
      type: () => UpdateOrderInput,
      nullable: true,
    })
    updateOrderInput,
  ) {
    const { id, status: statusId } = updateOrderInput;
    return this.prismaService.order.update({
      where: { id },
      data: {
        orderStatusId: statusId,
        ...updateOrderInput,
      },
    });
  }
}
