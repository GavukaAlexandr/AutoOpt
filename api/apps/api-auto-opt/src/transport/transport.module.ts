import { Module } from '@nestjs/common';
import { TransportService } from './transport.service';
import { TransportController } from './transport.controller';
import { PrismaService } from 'libs/db/src/prisma.service';

@Module({
  providers: [TransportService, PrismaService],
  controllers: [TransportController],
})
export class TransportModule {}
