import { Body, Controller, Post, UseGuards, Res, Req, Get } from '@nestjs/common';
import express from "express"
import { CreateUserDto } from '../dtos/create-user.dto';
import { validateOrReject } from 'class-validator';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/signup')
    async register(@Body() data: CreateUserDto): Promise<void> {
        await validateOrReject(data);
        const { email, password, username, dateOfBirth } = data;
    }

    @UseGuards(LocalAuthGuard)
    @Post('/signin')
    async login(@Req() req: express.Request, @Res({ passthrough: true }) res: express.Response): Promise<object> {
        return { message: 'login successfull' }
    }

    @Get('/logout')
    logout(@Req() req: any): any {
        req.session.destroy();
        return { msg: 'The user session has ended' }
    }
}
