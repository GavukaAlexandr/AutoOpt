import { Injectable } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { Admin, User } from '@prisma/client';
import { AdminCreateInput, AdminInput } from './gql/auth.model';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) { }

  async validateUser(phoneNumber: string, password: string,): Promise<any> {
    const admin = await this.adminService.findUniqueByPhone(phoneNumber);

    if (
      admin.phoneNumber === phoneNumber && 
      admin.password === password
      ) {
        const {password, ...result} = admin;
        return result;
    }
    return null;
  }

  async login(admin: AdminInput) {
    return {
      token: this.jwtService.sign({password: admin.password, phoneNumber: admin.phoneNumber }),
    };
  }
}
