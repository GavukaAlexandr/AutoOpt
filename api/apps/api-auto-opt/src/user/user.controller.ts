import { Public } from './../auth/decorators';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.decorator';
import { CreateUserDto } from './dto/CreateUserDto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { FireBaseService } from './firebase.service';
import { FirebaseError } from 'firebase-admin';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService, private fireBase: FireBaseService) { }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle(20, 60)
  @Post('/register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const isExist = await this.fireBase.isUserByPhoneExist(createUserDto.phoneNumber)
      if (isExist) return await this.userService.create(createUserDto);
      return
    } catch (err) {
      if (err && err.code === 'P2002') return this.logger.error('ERROR: Attempt to create an existing user', err)
      this.logger.error(err)
      return
    }
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
