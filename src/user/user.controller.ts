import { Public } from './../auth/decorators';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
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
    const user = await this.userService.findUniqueByPhone(
      currentUser.phoneNumber,
    );
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      telegramNotification: user.telegramNotification,
      viberNotification: user.viberNotification,
      phoneNotification: user.phoneNotification,
    };
  }

  @Put('notifications')
  async changeNotifications(
    @Body()
    notifications: {
      telegramNotification: boolean;
      viberNotification: boolean;
      phoneNotification: boolean;
    },
    @User() user: CreateUserDto,
  ) {
    if (this.userService.isOneOfNotificationsActive({ user, notifications }))
      return this.userService.changeNotificationsById(
        notifications,
        user.phoneNumber,
      );
    else
      throw new HttpException(
        'at least one notification channel must be active',
        HttpStatus.BAD_REQUEST,
      );
  }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Post('/is-exist')
  async isUserExist(@Body() body: { phoneNumber: string }) {
    const user = await this.userService.findUniqueByPhone(body.phoneNumber);
    return { isUserExist: !!user };
  }
}
