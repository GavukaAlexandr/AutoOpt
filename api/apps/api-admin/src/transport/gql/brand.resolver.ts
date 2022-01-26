import { Resolver, Query, Args, Int, Mutation, ID, ResolveField, Parent } from '@nestjs/graphql';
import { Brand, BrandFilter } from './brand.model';
import { Public } from '../../../../api-auto-opt/src/auth/decorators';
import { ListMetadata } from '../../list.metaData';
import { Type } from './type.model';
import { Model } from './model.model';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '@app/prisma';

@Resolver(of => Brand)
export class BrandResolver {
    constructor(private prismaService: PrismaService) { }

    @Query(returns => Brand)
    async Brand(@Args('id') id: string) {
        return this.prismaService.brand.findUnique({
            where: { id: id },
        });
    }

    @ResolveField('type', returns => [Type])
    async type(@Parent() brand: Brand) {
        const { id } = brand;
        const modelTypes = await this.prismaService.model.findMany({
            where: {
                brandId: id
            },
            select: { type: true },
            distinct: ['typeId']
        });

        const preparedTypes = modelTypes.map(modelBrand => {
            return plainToClass(Type, modelBrand.type);
        });

        return preparedTypes;
    }

    @ResolveField('models', returns => [Model])
    async model(@Parent() brand: Brand) {
        const { id } = brand;
        return this.prismaService.model.findMany({ where: { brandId: id } });
    }

    @Query(returns => [Brand])
    async allBrands(
        @Args('perPage', { type: () => Int, nullable: true }) perPage,
        @Args('page', { type: () => Int, nullable: true }) page,
        @Args('sortField', { type: () => String, nullable: true }) sortField,
        @Args('sortOrder', { type: () => String, nullable: true }) sortOrder,
        @Args('filter', { type: () => BrandFilter, nullable: true }) filter: BrandFilter,
    ) {
        return this.prismaService.brand.findMany({
            skip: page,
            take: perPage,
            orderBy: { [sortField]: sortOrder },
            where: {
                name: { contains: filter.name, mode: 'insensitive'}
            }
        });
    }

    @Query(returns => [Brand])
    async allBrandsOfType(
        @Args('perPage', { type: () => Int, nullable: true }) perPage,
        @Args('page', { type: () => Int, nullable: true }) page,
        @Args('filter', { type: () => BrandFilter, nullable: true }) filter: BrandFilter,
    ) {
        const modelBrands = await this.prismaService.model.findMany({
            skip: page,
            take: perPage,
            where: {
                brand: { name: { contains: filter.q } },
                type: { id: filter.typeId }
            },
            select: { brand: true },
            distinct: ['brandId']
        });

        const preparedBrands = modelBrands.map(modelBrand => {
            return plainToClass(Brand, modelBrand.brand);
        });
        return preparedBrands;
    }

    @Query(returns => ListMetadata)
    async allBrandsMeta(
        @Args('perPage', { type: () => Int, nullable: true }) perPage,
        @Args('page', { type: () => Int, nullable: true }) page,
        @Args('sortField', { type: () => String, nullable: true }) sortField: string,
        @Args('sortOrder', { type: () => String, nullable: true }) sortOrder: string,
        @Args('filter', { type: () => BrandFilter, nullable: true }) filter: BrandFilter,
    ) {
        const count = await this.prismaService.brand.count(({
            orderBy: { [sortField]: sortOrder },
            where: {
                name: { contains: filter.name, mode: 'insensitive' }
            }
        }));
        return { count: count };
    }


    @Mutation(() => Brand)
    async createBrand(
        @Args({ name: 'name', type: () => String, nullable: true }) name) {
        return this.prismaService.brand.create({
            data: {
                name
            }
        });
    }

    @Mutation(() => Brand)
    async updateBrand(
        @Args({ name: 'id', type: () => ID, nullable: true }) id,
        @Args({ name: 'name', type: () => String, nullable: true }) name) {
        return this.prismaService.brand.update(
            {
                where: {
                    id
                },
                data: {
                    name
                }
            }
        );
    }

    // @Public()
    // @Mutation(returns => Boolean)
    // async deleteOrder(@Args({ name: 'id', type: () => ID }) id: string) {
    //     return this.prismaService.order.update({
    //         where: { id: deleteOrderInput.id },
    //         data: {
    //             isDeleted: true,
    //         },
    //     });
    // }
}
