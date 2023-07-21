import { Body, Controller, Post, UseGuards, Req, Get, NotFoundException, Param, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { validateOrReject } from 'class-validator';
import { EnsureIsAuthenticatedGuard, LocalAuthGuard } from './auth.guard';
import { UserService } from '../user/user.service';
import { CriticalException, is, isError, throwIfIsError } from '../../utils';
import { Role, User } from '../../entities/user.entity';
import { randomUUID } from 'crypto';
import { EmailService } from '../email/email.service';
import { EmailConfirmation } from '../../entities/email-confirmation.entity';
import { EmailConfirmationService } from '../email/email-confirmation/email-confirmation.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly emailService: EmailService,
        private readonly emailConfirmationService: EmailConfirmationService,
    ) { }

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

        const user = await this.userService.findUserByUsername(data.username);

        if (isError(user)) {
            if (is(user, NotFoundException)) {
                throw new CriticalException('A critical error has occurred. His account seems to have been created, but apparently something went wrong. Please report this to the Wany team.');
            }

            throw user;
        }

        // generate email confirmation token, save in database and then send in the user email
        const emailConfirmation: EmailConfirmation = {
            id: randomUUID(),
            email: user.email!,
            token: this.emailConfirmationService.generateToken(),
            used: false,
            user_id: user.id!
        }

        throwIfIsError(await this.emailConfirmationService.createEmailConfirmation(emailConfirmation));
        throwIfIsError(await this.emailService.sendConfirmationEmail(user, emailConfirmation));

        return {
            message: 'Your account has been created successfully'
        };
    }

    @UseGuards(EnsureIsAuthenticatedGuard)
    @Post('/email/verification/:token')
    async verifyEmailConfirmationToken(@Req() req: Request, @Param('token') token: string) {
        const user: User = req.user!;
        const emailConfirmation = await this.emailConfirmationService.findEmailConfirmationWithToken(token);
        if (isError(emailConfirmation)) throw emailConfirmation;

        if (emailConfirmation.user_id !== user.id) {
            throw new BadRequestException("Invalid email confirmation token");
        }

        if (emailConfirmation.used) {
            throw new BadRequestException("This token is already used");
        }

        throwIfIsError(await this.emailConfirmationService.markEmailConfirmationTokenAsUsed(emailConfirmation.id));

        this.userService.update(user.id, { verified: true });

        return {
            message: "Email verified successfully"
        }
    }

    @UseGuards(LocalAuthGuard)
    @Post('/signin')
    async login(): Promise<any> {
        return { message: 'You are logged' }
    }

    @Get('/logout')
    logout(@Req() req: any): any {
        req.session.destroy();
        return { message: 'The user session has ended' }
    }
}
