import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/CreateUserDto';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUniqueByPhone(phoneNumber: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { phoneNumber },
    });
  }

  async create(user: CreateUserDto): Promise<User> {
    const { ...newUser } = user;
    return this.prisma.user.create({
      data: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        telegramNotification: newUser.telegramNotification,
        viberNotification: newUser.viberNotification,
        phoneNotification: newUser.phoneNotification,
      },
    });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findOne(id: User['id']): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findOneByEmail(email: User['email']): Promise<User> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async remove(id: User['id']): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
