import { OrderStatus } from ".prisma/client";
import { Resolver, Query } from "@nestjs/graphql";
import { Public } from "./auth/decorators";
import { Enums } from "./enum.model";
import { PrismaService } from "./prisma.service";

@Resolver(of => Enums)
export class EnumResolver {
    constructor(private prismaService: PrismaService) { }

    @Public()
    @Query(() => [String])
    async orderStatuses() {
        return await Object.values(OrderStatus);
    }
}