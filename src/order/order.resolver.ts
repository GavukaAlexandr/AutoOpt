import { Resolver, Query, Args } from '@nestjs/graphql';
import { Public } from 'src/auth/decorators';
import { PrismaService } from 'src/prisma.service';

@Resolver('Order')
export class OrderResolver {
  constructor(private prismaService: PrismaService) {}
  
  @Public()
  @Query()
  async order(@Args('id') id: string) {
    return this.prismaService.order.findUnique({ where: { id: id } });
  }
}
