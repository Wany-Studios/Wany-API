import { Body, Controller, Post, UseGuards, Res, Req, Get } from '@nestjs/common';
import express from "express"
import { CreateUserDto } from '../dtos/create-user.dto';
import { validateOrReject } from 'class-validator';
import { LocalAuthGuard } from './auth.guard';
import { UserService } from '../user/user.service';
import { isError } from '../utils';
import { Role } from '../user/user.entity';
import { randomUUID } from 'crypto';

@Controller('auth')
export class AuthController {
    constructor(private readonly userService: UserService) { }

    @Post('/signup')
    async register(@Body() data: CreateUserDto): Promise<any> {
        await validateOrReject(data);

        const { dateOfBirth, email, password, username } = data;

        const result = await this.userService.create({
            id: randomUUID(),
            username,
            email,
            password,
            birth_date: dateOfBirth,
            role: Role.User,
            verified: false
        });

        if (isError(result)) throw result;

        return { ...result }
    }

    @UseGuards(LocalAuthGuard)
    @Post('/signin')
    async login(): Promise<object> {
        return { message: 'successful login' }
    }

    @Get('/logout')
    logout(@Req() req: any): any {
        req.session.destroy();
        return { message: 'The user session has ended' }
    }
}
