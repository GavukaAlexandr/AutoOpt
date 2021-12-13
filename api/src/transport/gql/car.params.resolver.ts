import { OrderStatus, prisma } from '.prisma/client';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { Public } from 'src/auth/decorators';
import { IBodyType, IDriveType, IFuelType, IOrderStatus, IPartType, ITransmission } from 'src/order/gql/models';
import { PrismaService } from 'src/prisma.service';
import { UserCarParams } from 'src/user/gql/user.car.params.model';

@Resolver(of => UserCarParams)
export class CarParamsResolver {
    constructor(private prismaService: PrismaService) { }

    @Public()
    @Query(() => [ITransmission])
    async transmissions() {
        return this.prismaService.transmission.findMany({});
    }

    @Public()
    @Query(() => [IFuelType])
    async fuelTypes() {
        return this.prismaService.fuelType.findMany({});
    }

    @Public()
    @Query(() => [IDriveType])
    async driveTypes() {
        return this.prismaService.driveType.findMany({});
    }

    @Public()
    @Query(() => [IBodyType])
    async bodyTypes() {
        return this.prismaService.bodyType.findMany({});
    }

    @Public()
    @Query(() => [IPartType])
    async partTypes() {
        return this.prismaService.partType.findMany({});
    }

    @Public()
    @Query(() => [IOrderStatus])
    async orderStatuses() {
        return this.prismaService.orderStatus.findMany({});
    }
    
}
