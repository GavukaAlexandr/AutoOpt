import { Resolver, Query, Args, Int, Mutation, ID, Parent, ResolveField } from '@nestjs/graphql';
import { Type, TypeFilter, UpdateType } from './type.model';
import { Public } from 'src/auth/decorators';
import { ListMetadata } from 'src/list.metaData';
import { PrismaService } from 'src/prisma.service';
import { Brand, BrandFilter } from './brand.model';
import { plainToClass } from 'class-transformer';
import { Model } from './model.model';
import { OrderStatus } from '.prisma/client';

@Resolver(of => Type)
export class TypeResolver {
    constructor(private prismaService: PrismaService) { }

    @Public()
    @Query(returns => Type)
    async Type(@Args('id') id: string) {
        return this.prismaService.type.findUnique({
            where: { id: id },
        });
    }

    @Public()
    @Query(returns => [Type])
    async allTypes(
        @Args('perPage', { type: () => Int, nullable: true }) perPage,
        @Args('page', { type: () => Int, nullable: true }) page,
        @Args('sortField', { type: () => String, nullable: true }) sortField,
        @Args('sortOrder', { type: () => String, nullable: true }) sortOrder,
        @Args('filter', { type: () => TypeFilter, nullable: true }) filter: TypeFilter,
    ) {
        return this.prismaService.type.findMany({
            skip: page,
            take: perPage,
            orderBy: { [sortField]: sortOrder },
            where: {
                id: {
                    in: filter.ids
                },
                name: {
                    contains: filter.q
                }
            }
        });
    }

    @Public()
    @Query(returns => ListMetadata)
    async _allTypesMeta(
        @Args('perPage', { type: () => Int, nullable: true }) perPage,
        @Args('page', { type: () => Int, nullable: true }) page,
        @Args('sortField', { type: () => String, nullable: true }) sortField: string,
        @Args('sortOrder', { type: () => String, nullable: true }) sortOrder: string,
        @Args('filter', { type: () => TypeFilter, nullable: true }) filter: TypeFilter,
    ) {
        const count = await this.prismaService.type.count(({
            orderBy: { [sortField]: sortOrder },
            where: {
                id: { in: filter.ids },
            }
        }));
        return { count: count };
    }

    @Public()
    @ResolveField('brands', () => [Brand])
    async brand(@Parent() type: Type) {
        const { id } = type;
        const modelBrands = await this.prismaService.model.findMany({
            where: {
                typeId: id,
            },
            select: { brand: true },
            distinct: ['brandId']
        });

        const preparedBrands = modelBrands.map(modelBrand => {
            return plainToClass(Brand, modelBrand.brand);
        });

        return preparedBrands;
    }

    @Public()
    @ResolveField('models', returns => [Model])
    async models(@Parent() type: Type) {
        const { id } = type;
        return this.prismaService.model.findMany({ where: { typeId: id } });
    }

    @Public()
    @Mutation(() => Type)
    async createType(@Args({ name: 'name', type: () => String! }) name) {
        return this.prismaService.type.create({
            data: {
                name: name
            }
        });
    }

    @Public()
    @Mutation(returns => Type)
    async updateType(
        @Args({ name: 'id', type: () => ID! }) id,
        @Args({ name: 'name', type: () => String! }) name) {
        return this.prismaService.type.update({
            where: { id: id },
            data: {
                name: name
            },
        });
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

/* createType {
    data: createType {
        brands {
            id
        }
        id
        models {
            id
        }
        name
    }
} */