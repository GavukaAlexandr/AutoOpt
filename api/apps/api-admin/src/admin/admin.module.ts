import { PrismaService } from '../../../../libs/db/src/prisma.service';
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';

@Module({
  controllers: [],
  providers: [AdminService, PrismaService],
  exports: [AdminService],
})
export class AdminModule {}
