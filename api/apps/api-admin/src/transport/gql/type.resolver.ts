import { Resolver, Query, Args, Int, Mutation, ID, Parent, ResolveField } from '@nestjs/graphql';
import { Type, TypeFilter, UpdateType } from './type.model';
import { Public } from '../../../../api-auto-opt/src/auth/decorators';
import { Brand, BrandFilter } from './brand.model';
import { plainToClass } from 'class-transformer';
import { Model } from './model.model';
import { ListMetadata } from '../../list.metaData';
import { PrismaService } from '@app/prisma';

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
    ) {
        return this.prismaService.type.findMany({
            skip: page,
            take: perPage,
            orderBy: { [sortField]: sortOrder },
        });
    }

    @Public()
    @Query(returns => ListMetadata)
    async allTypesMeta(
        @Args('sortField', { type: () => String, nullable: true }) sortField: string,
        @Args('sortOrder', { type: () => String, nullable: true }) sortOrder: string,
    ) {
        const count = await this.prismaService.type.count(({
            orderBy: { [sortField]: sortOrder },
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
    async createType(@Args({ name: 'name', type: () => String, nullable: true }) name) {
        return this.prismaService.type.create({
            data: {
                name: name
            }
        });
    }

    @Public()
    @Mutation(returns => Type)
    async updateType(
        @Args({ name: 'id', type: () => ID, nullable: true }) id,
        @Args({ name: 'name', type: () => String, nullable: true }) name) {
        return this.prismaService.type.update({
            where: { id },
            data: {
                name
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