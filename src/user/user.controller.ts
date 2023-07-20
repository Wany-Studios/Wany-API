import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { handleIsInternalServerError, isError, } from '../utils';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async allUsers(): Promise<User[]> {
    return await this.userService.find();
  }

  @Get('/:username')
  async byUsername(@Param('username') username: string): Promise<User> {
    if (!username || !username.trim()) {
      throw new BadRequestException("username cannot be empty")
    }

    const user = await this.userService.findUserByUsername(username);

    if (isError(user)) {
      handleIsInternalServerError(user);
      throw user;
    }

    return user;
  }
}
