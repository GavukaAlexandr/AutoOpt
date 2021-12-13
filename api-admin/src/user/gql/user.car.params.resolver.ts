import { OrderStatus } from '.prisma/client';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { Public } from 'src/auth/decorators';
import { PrismaService } from 'src/prisma.service';
import { CreateCarParamsInput, UpdateUserCarParamsInput, UserCarParams } from './user.car.params.model';

@Resolver(of => UserCarParams)
export class UserCarParamsResolver {
    constructor(private prismaService: PrismaService) { }

    @Public()
    @Query(() => UserCarParams)
    async userCarParams(@Args('id', { type: () => ID, nullable: true }) id: string) {
        const userCarParams = await this.prismaService.userCarParams.findFirst({
            where: { id },
            include: {
                fuels: {
                    select: {
                        fuel: true
                    }
                },
                bodyType: true,
                transmission: true,
                partOfType: true,
                drive: true,
                model: {
                    include: {
                        brand: true,
                        type: true
                    }
                }
            },
        })
        const result = userCarParams.fuels.map((v) => v.fuel);
        return plainToClass(UserCarParams, { ...userCarParams, fuels: result });
    }

    // @Public()
    // @Query(() => UserCarParams)
    // async userCarParams() {
    //     const userCarParams = await this.prismaService.userCarParams.findFirst({
    //         include: { fuels: { select: { fuel: true } } },
    //     })
    //     const result = userCarParams.fuels.map((v) => v.fuel);
    //     return plainToClass(UserCarParams, { ...userCarParams, fuels: result });
    // }

    @Public()
    @Mutation(() => UserCarParams)
    async createCarParams(@Args({ name: 'createCarParamsInput', type: () => CreateCarParamsInput }) createCarParamsInput) {
        const { modelId, userId, fuelId, transmissionId, bodyTypeId, driveTypeId, partTypeId, ...preparedCarParms } = createCarParamsInput;
        return this.prismaService.userCarParams.create({
            data: {
                fuels: {
                    create: fuelId.map(id => ({
                        fuelId: id
                    }))
                },
                ...preparedCarParms,
                transmission: { connect : { id: transmissionId } },
                bodyType: { connect: { id: bodyTypeId } },
                drive: { connect: { id: driveTypeId } },
                partOfType: { connect: { id: partTypeId } },
                user: { connect: { id: userId } },
                model: { connect: { id: modelId } },
            },
            include: { model: { include: { brand: true, type: true } }, user: true, fuels: true, bodyType: true, drive: true, partOfType: true, transmission: true }
        });
    }

    @Public()
    @Mutation(() => UserCarParams)
    async updateUserCarParams(@Args({ name: 'updateUserCarParamsInput', type: () => UpdateUserCarParamsInput, nullable: true }) updateUserCarParamsInput) {
        const { id, bodyType,carPart,drive,fuel,engineVolume,modelId, partOfType, transmission, } = updateUserCarParamsInput;
        return this.prismaService.userCarParams.update({
            where: { id },
            data: {
                // ...
                bodyTypeId: bodyType
            }
        })
    }
}