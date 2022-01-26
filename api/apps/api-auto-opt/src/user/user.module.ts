import { PrismaService } from '../../../../libs/db/src/prisma.service';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FireBaseService } from './firebase.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot()
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService, FireBaseService, ConfigService],
  exports: [UserService],
})
export class UserModule {}
