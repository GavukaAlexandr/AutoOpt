import { Public } from './../auth/decorators';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.decorator';
import { CreateUserDto } from './dto/CreateUserDto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle(3, 60)
  @Post('/register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/self')
  async getUser(@Param() params, @User() currentUser: CreateUserDto) {
    const user = await this.userService.findOneByEmail(currentUser.email);
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Post('/is-exist')
  async isUserExist(@Body() body: { email: string }) {
    const user = await this.userService.findOneByEmail(body.email);
    return { isUserExist: !!user };
  }
}
