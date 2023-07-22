import {
    BadRequestException,
    Controller,
    Get,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';
import { handleIsInternalServerError, isError } from '../../utils';
import { EnsureIsAuthenticatedGuard } from '../auth/auth.guard';
import { Request } from 'express';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(EnsureIsAuthenticatedGuard)
    @Get('/me')
    async getInfo(@Req() req: Request) {
        const user = await this.userService.findUserById(req.user.id!);
        return { user };
    }

    @Get('/public/:username')
    async byUsername(@Param('username') username: string): Promise<User> {
        if (!username || !username.trim()) {
            throw new BadRequestException('username cannot be empty');
        }

        const user = await this.userService.findUserByUsername(username);

        if (isError(user)) {
            handleIsInternalServerError(user);
            throw user;
        }

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
        };
    }
}
