import { Module } from '@nestjs/common';
import { TransportService } from './transport.service';
import { TransportController } from './transport.controller';

@Module({
  providers: [TransportService],
  controllers: [TransportController],
})
export class TransportModule {}
