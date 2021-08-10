import { PrismaService } from './prisma.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { TransportModule } from './transport/transport.module';

@Module({
  imports: [OrderModule, UserModule, TransportModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
