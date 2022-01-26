import { Resolver, Query, Args, Int, Mutation, ID, Parent, ResolveField } from '@nestjs/graphql';
import { Type } from './type.model';
import { Public } from '../../../../api-auto-opt/src/auth/decorators';
import { ListMetadata } from '../../list.metaData';
import { Brand } from './brand.model';
import { Model, ModelFilter } from './model.model';
import { PrismaService } from '@app/prisma';

@Resolver(of => Model)
export class ModelResolver {
    constructor(private prismaService: PrismaService) { }

    @Query(returns => Model)
    async Model(@Args('id') id: string) {
        return this.prismaService.model.findUnique({
            where: { id: id },
        });
    }

    @ResolveField('brand', () => Brand)
    async brand(@Parent() model: Model) {
        const { brandId } = model;
        return this.prismaService.brand.findUnique({ where: { id: brandId } });
    }

    @Query(returns => [Model])
    async allModels(
        @Args('perPage', { type: () => Int, nullable: true }) perPage,
        @Args('page', { type: () => Int, nullable: true }) page,
        @Args('sortField', { type: () => String, nullable: true }) sortField,
        @Args('sortOrder', { type: () => String, nullable: true }) sortOrder,
        @Args('filter', { type: () => ModelFilter, nullable: true }) filter: ModelFilter,
    ) {
        return this.prismaService.model.findMany({
            skip: page,
            take: perPage,
            orderBy: { [sortField]: sortOrder },
            where: {
                name: { contains: filter.q, mode: "insensitive" },
                brandId: filter.brandId,
                typeId: filter.typeId,
                brand: { name: { contains: filter.brand, mode: "insensitive" } }
            },
            include: { type: true }
        });

    }

    @Query(returns => ListMetadata)
    async allModelsMeta(
        @Args('sortField', { type: () => String, nullable: true }) sortField: string,
        @Args('sortOrder', { type: () => String, nullable: true }) sortOrder: string,
        @Args('filter', { type: () => ModelFilter, nullable: true }) filter: ModelFilter,
    ) {
        const count = await this.prismaService.model.count(({
            orderBy: { [sortField]: sortOrder },
            where: {
                name: { contains: filter.q, mode: "insensitive" },
                brandId: filter.brandId,
                typeId: filter.typeId,
                brand: { name: { contains: filter.brand, mode: "insensitive" } }
            }
        }));
        return { count: count };
    }

    @Mutation(() => Model)
    async updateModel(
        @Args({ name: 'id', type: () => ID, nullable: true }) id,
        @Args({ name: 'name', type: () => String, nullable: true }) name,
        @Args({ name: 'brand', type: () => ID, nullable: true }) brand,
        @Args({ name: 'type', type: () => ID, nullable: true }) type,
    ) {
        return this.prismaService.model.update(
            {
                where: { id },
                data: {
                    name,
                    brandId: brand,
                    typeId: type
                }
            }
        )
    }

    @Mutation(() => Model)
    async createModel(
        @Args({ name: 'name', type: () => String, nullable: true }) name,
        @Args({ name: 'brandId', type: () => ID, nullable: true }) brand,
        @Args({ name: 'typeId', type: () => ID, nullable: true }) type,
    ) {
        return this.prismaService.model.create({
            data: {
                name,
                brand: {
                    connect: {
                        id: brand
                    }
                },
                type: {
                    connect: {
                        id: type
                    }
                }
            },
            include: { brand: true, type: true }
        });
    }

    // @Public()
    // @ResolveField('brands', returns => [Brand])
    // async brand(@Parent() type: Type) {
    //     const { id } = type;
    //     return this.prismaService.brand.findMany({ where: { types: { every: { typeId: id } } } });
    // }


    // @Public()
    // @Mutation(returns => Type)
    // async updateType(@Args({ name: 'updateTypeInput', type: () => UpdateTypeInput }) updateTypeInput) {
    //     const { id, ...preparedType } = updateTypeInput;
    //     return this.prismaService.type.update({
    //         where: { id: id },
    //         data: { ...preparedType },
    //     });
    // }

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