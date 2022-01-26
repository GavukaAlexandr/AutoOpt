import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      passwordField: 'password', //needed for passport local strategy with one field
      usernameField: 'phoneNumber',
    });
  }

  async validate(phoneNumber: string, password: string, ): Promise<any> {
    const admin = await this.authService.validateUser(phoneNumber, password);
    if (!admin) {
      throw new UnauthorizedException();
    }
    return admin;
  }
}
