import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'phoneNumber',
      passwordField: 'phoneNumber', //needed for passport local strategy with one field
    });
  }

  async validate(phoneNumber: string): Promise<any> {
    const user = await this.authService.validateUser(phoneNumber);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
