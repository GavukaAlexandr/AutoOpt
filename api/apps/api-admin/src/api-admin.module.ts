import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApiAdminController } from './api-admin.controller';
import { ApiAdminService } from './api-admin.service';
import { PrismaService } from '@app/prisma';
import { AuthModule } from './auth/auth.module';
import { OrderResolver } from './order/gql/order.resolver';
import { UserResolver } from './user/gql/user.resolver';
import { TypeResolver } from './transport/gql/type.resolver';
import { BrandResolver } from './transport/gql/brand.resolver';
import { ModelResolver } from './transport/gql/model.resolver';
import { UserCarParamsResolver } from './user/gql/user.car.params.resolver';
import { CarParamsResolver } from './transport/gql/car.params.resolver';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthResolver } from './auth/gql/auth.resolver';
import { AdminModule } from './admin/admin.module';
import { AdminService } from './admin/admin.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    AdminModule,
    AuthModule,
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        ttl: 60,
        limit: 60,
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../../public'),
      serveRoot: '/public',
    }),
    GraphQLModule.forRoot({
      debug: true,
      autoSchemaFile: join(process.cwd(), '/apps/api-admin/src/schema.gql'),
      playground: true,
      context: ({ req }) => ({ req }),
      sortSchema: true,
    }),
  ],
  controllers: [ApiAdminController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AdminService,
    AuthResolver,
    ApiAdminService,
    PrismaService,
    OrderResolver,
    UserResolver,
    TypeResolver,
    BrandResolver,
    ModelResolver,
    UserCarParamsResolver,
    CarParamsResolver,
  ],
})
export class ApiAdminModule {}
