import { PrismaService } from './prisma.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './modules/orders/orders.module';
import { UserModule } from './modules/user/user.module';
import { TransportModule } from './modules/transport/transport.module';

@Module({
  imports: [OrdersModule, UserModule, TransportModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
