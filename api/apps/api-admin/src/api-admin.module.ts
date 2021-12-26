import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApiAdminController } from './api-admin.controller';
import { ApiAdminService } from './api-admin.service';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { PrismaService } from '@app/prisma';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrderResolver } from './order/gql/order.resolver';
import { UserResolver } from './user/gql/user.resolver';
import { TypeResolver } from './transport/gql/type.resolver';
import { BrandResolver } from './transport/gql/brand.resolver';
import { ModelResolver } from './transport/gql/model.resolver';
import { UserCarParamsResolver } from './user/gql/user.car.params.resolver';
import { CarParamsResolver } from './transport/gql/car.params.resolver';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ThrottlerModule.forRootAsync({
      // imports: [ConfigModule],
      // inject: [ConfigService],
      useFactory: (/* config: ConfigService */) => ({
        ttl: 60, //config.get('THROTTLE_TTL'),
        limit: 60, //config.get('THROTTLE_LIMIT'),
      }),
    }),
    GraphQLModule.forRoot({
      debug: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      sortSchema: true,
      // typePaths: ['./**/*.graphql'],
      // definitions: {
      //   path: join(process.cwd(), 'src/graphql.ts'),
      //   outputAs: 'class',
      // },
      // plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
  ],
  controllers: [ApiAdminController],
  providers: [ApiAdminService, PrismaService, OrderResolver, UserResolver, TypeResolver, BrandResolver, ModelResolver, UserCarParamsResolver, CarParamsResolver],
})
export class ApiAdminModule {}
