import { Resolver, Query, Args, Int, Mutation, ID, Parent, ResolveField } from '@nestjs/graphql';
import { Type } from './type.model';
import { Public } from 'src/auth/decorators';
import { ListMetadata } from 'src/list.metaData';
import { PrismaService } from 'src/prisma.service';
import { Brand } from './brand.model';
import { Model, ModelFilter } from './model.model';

@Resolver(of => Model)
export class ModelResolver {
    constructor(private prismaService: PrismaService) { }

    @Public()
    @Query(returns => Model)
    async Model(@Args('id') id: string) {
        return this.prismaService.model.findUnique({
            where: { id: id },
        });
    }

    // @Public()
    // @ResolveField('type', returns => [Type])
    // async type(@Parent() model: Model) {
    //     const { id } = model;
    //     return this.prismaService.type.findUnique({ where: {} });
    // }

    @Public()
    @ResolveField('brand', () => Brand)
    async brand(@Parent() model: Model) {
        const { brandId } = model;
        return this.prismaService.brand.findUnique({ where: { id: brandId } });
    }

    @Public()
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
                name: { contains: filter.q },
                brandId: filter.brandId,
                typeId: filter.typeId
            },
            include: { type: true }
        });

    }

    @Public()
    @Query(returns => ListMetadata)
    async _allModelsMeta(
        @Args('perPage', { type: () => Int, nullable: true }) perPage,
        @Args('page', { type: () => Int, nullable: true }) page,
        @Args('sortField', { type: () => String, nullable: true }) sortField: string,
        @Args('sortOrder', { type: () => String, nullable: true }) sortOrder: string,
        @Args('filter', { type: () => ModelFilter, nullable: true }) filter: ModelFilter,
    ) {
        const count = await this.prismaService.model.count(({
            orderBy: { [sortField]: sortOrder },
            where: {
                // id: { in: filter.ids },
                name: { contains: filter.q },
                // brandId: { equals: filter.brandIds },
                // typeId: { equals: filter.typeIds }
            }
        }));
        return { count: count };
    }

    @Public()
    @Mutation(() => Model)
    async createModel(
        @Args({ name: 'name', type: () => String! }) name,
        @Args({ name: 'brandIds', type: () => ID, nullable: true }) brand,
        @Args({ name: 'typeIds', type: () => ID, nullable: true }) type,
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
            }
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