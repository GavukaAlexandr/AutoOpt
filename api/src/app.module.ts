import { PrismaService } from './prisma.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { TransportModule } from './transport/transport.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { OrderResolver } from './order/gql/order.resolver';
import { UserResolver } from './user/gql/user.resolver';
import { TypeResolver } from './transport/gql/type.resolver';
import { BrandResolver } from './transport/gql/brand.resolver';
import { ModelResolver } from './transport/gql/model.resolver';
import { OrderStatus } from '.prisma/client';
import { EnumResolver } from './enum.resolver';

@Module({
  imports: [
    OrderModule,
    UserModule,
    AuthModule,
    TransportModule,
    ThrottlerModule.forRootAsync({
      // imports: [ConfigModule],
      // inject: [ConfigService],
      useFactory: (/* config: ConfigService */) => ({
        ttl: 60, //config.get('THROTTLE_TTL'),
        limit: 60, //config.get('THROTTLE_LIMIT'),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../public'),
      serveRoot: '/public',
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
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    OrderResolver, UserResolver, TypeResolver, BrandResolver, ModelResolver, EnumResolver
  ],
})
export class AppModule {}
