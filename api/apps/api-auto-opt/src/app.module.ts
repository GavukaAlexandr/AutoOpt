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
import { PrismaService } from 'libs/db/src/prisma.service';

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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
   
  ],
})
export class AppModule {}
