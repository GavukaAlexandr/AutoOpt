import { Resolver, Query, Args, Int, Mutation, ID, ResolveField, Parent } from '@nestjs/graphql';
import { Brand, BrandFilter } from './brand.model';
import { Public } from 'src/auth/decorators';
import { ListMetadata } from 'src/list.metaData';
import { PrismaService } from 'src/prisma.service';
import { Type } from './type.model';
import { Model } from './model.model';

@Resolver(of => Brand)
export class BrandResolver {
    constructor(private prismaService: PrismaService) { }

    @Public()
    @Query(returns => Brand)
    async Brand(@Args('id') id: string) {
        return this.prismaService.brand.findUnique({
            where: { id: id },
        });
    }

    @Public()
    @ResolveField('type', returns => [Type])
    async type(@Parent() brand: Brand) {
        const { id } = brand;
        return this.prismaService.model.findMany({ 
            where: { 
                brandId: id
            },
            select: { type: true }
        });
    }

    @Public()
    @ResolveField('models', returns => [Model])
    async brand(@Parent() brand: Brand) {
        const { id } = brand;
        return this.prismaService.model.findMany({ where: { brandId: id } });
    }

    @Public()
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
                id: { in: filter.ids },
            }
        });
    }

    @Public()
    @Query(returns => ListMetadata)
    async _allBrandsMeta(
        @Args('perPage', { type: () => Int, nullable: true }) perPage,
        @Args('page', { type: () => Int, nullable: true }) page,
        @Args('sortField', { type: () => String, nullable: true }) sortField: string,
        @Args('sortOrder', { type: () => String, nullable: true }) sortOrder: string,
        @Args('filter', { type: () => BrandFilter, nullable: true }) filter: BrandFilter,
    ) {
        const count = await this.prismaService.brand.count(({
            orderBy: { [sortField]: sortOrder },
            where: {
                id: { in: filter.ids },
            }
        }));
        return { count: count };
    }


    @Public()
    @Mutation(() => Brand)
    async createBrand(
        @Args({ name: 'name', type: () => String! }) name) {
        return this.prismaService.brand.create({
            data: {
                name: name,
            }
        });
    }

    // @Public()
    // @Mutation(returns => Brand)
    // async updateBrand(
    //     @Args({ name: 'id', type: () => ID! }) id,
    //     @Args({ name: 'typeIds', type: () => [ID!], nullable: true }) ids,
    //     @Args({ name: 'name', type: () => String! }) name
    // ) {
    //     return this.prismaService.brand.update({
    //         where: { id },
    //         data: {
    //             name,
    //             types: {
    //                 upsert: {

    //                 }
    //             }
    //         },
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
