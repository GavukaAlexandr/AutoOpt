import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(phoneNumber: string, firebaseUid: string): Promise<any> {
    const user = await this.userService.findUniqueByPhone(phoneNumber);

    if (user.phoneNumber === phoneNumber && user.firebaseUid === firebaseUid) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const { token, createdAt, updatedAt, id, ...payload } = user;

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
