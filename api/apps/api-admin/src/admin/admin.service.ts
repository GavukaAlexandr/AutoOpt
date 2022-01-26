import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../libs/db/src/prisma.service';
import { Admin, User } from '@prisma/client';
import { AdminCreateInput } from '../auth/gql/auth.model';
@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findUniqueByPhone(phoneNumber: string): Promise<Admin> {
    return this.prisma.admin.findUnique({
      where: { phoneNumber },
    });
  }

  async register(admin: AdminCreateInput) {
    return this.prisma.admin.create({
        data: {
            ...admin
        }
    })
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findOne(id: User['id']): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findOneByEmail(phoneNumber: User['phoneNumber']): Promise<User> {
    return this.prisma.user.findUnique({ where: { phoneNumber } });
  }
}
