import { OrderStatus } from '.prisma/client';
import { PrismaService } from 'libs/db/src/prisma.service';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { Public } from '../../auth/decorators';
import { PrismaClient } from '@prisma/client'
import { CreateCarParamsInput, UpdateUserCarParamsInput, UserCarParams } from './user.car.params.model';
import { json } from 'express';
const prisma = new PrismaClient()

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
        const { id, bodyType, carPart, drive, fuel, engineVolume, year, modelId, partOfType, transmission, vin} = updateUserCarParamsInput;

        const deleteFuels = this.prismaService.userCarParams.update({
            where: { id },
            data: {
                fuels: { deleteMany: {} }
            }
        });

        const updateUserCarParams = this.prismaService.userCarParams.update({
            where: { id },
            data: {
                fuels: {
                    create: fuel?.map(fuelId => ({
                        fuelId
                    }))
                },
                transmission: { connect: {id: transmission} },
                bodyType: { connect: { id: bodyType } },
                drive: { connect: { id: drive } },
                partOfType: { connect: { id: partOfType } },
                model: { connect: { id: modelId } },
                engineVolume,
                carPart,
                year,
                vin,
            },
                include: { fuels: true, transmission: true }
            })
        const [, result] = await prisma.$transaction([deleteFuels, updateUserCarParams]);
        return result;
    }
}